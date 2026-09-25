import crypto from "crypto";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

/* -------------------------------------------------------
   FIREBASE ADMIN
------------------------------------------------------- */

const firebaseAdminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });

const adminAuth = getAdminAuth(firebaseAdminApp);
const adminDb = getAdminFirestore(firebaseAdminApp);

/* -------------------------------------------------------
   VERIFY FIREBASE ADMIN
------------------------------------------------------- */

async function requireAdmin(req) {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    const error = new Error("Authentication required.");
    error.status = 401;
    throw error;
  }

  const idToken = authorization.substring(7);

  const decodedToken = await adminAuth.verifyIdToken(idToken);

  const adminDoc = await adminDb
    .collection("admins")
    .doc(decodedToken.uid)
    .get();

  if (!adminDoc.exists || adminDoc.data()?.active !== true) {
    const error = new Error("Admin access denied.");
    error.status = 403;
    throw error;
  }

  return decodedToken;
}

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function calculatePaymentAmounts(price) {
  const total = Number(price) || 0;

  const upfrontAmount = Math.round(total * 0.7);
  const balanceAmount = total - upfrontAmount;

  return {
    upfrontPercentage: 70,
    upfrontAmount,
    balancePercentage: 30,
    balanceAmount,
  };
}

function createAgreementToken() {
  return crypto.randomBytes(32).toString("hex");
}

/* -------------------------------------------------------
   GET AGREEMENTS
------------------------------------------------------- */

async function getAgreements(req, res) {
  /*
    Customer request:
    /api/agreements?token=xxxx

    Admin request:
    /api/agreements
  */

  const { token } = req.query;

  /* -----------------------------------------------
     CUSTOMER: GET AGREEMENT BY TOKEN
  ------------------------------------------------ */

  if (token) {
    const snapshot = await adminDb
      .collection("agreements")
      .where("agreementToken", "==", token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: "Agreement not found.",
      });
    }

    const document = snapshot.docs[0];

    const agreement = {
      id: document.id,
      ...document.data(),
    };

    /*
      Do not expose the private token back to the customer.
    */
    delete agreement.agreementToken;

    return res.status(200).json({
      agreement,
    });
  }

  /* -----------------------------------------------
     ADMIN: GET ALL AGREEMENTS
  ------------------------------------------------ */

  await requireAdmin(req);

  const snapshot = await adminDb
    .collection("agreements")
    .orderBy("createdAt", "desc")
    .get();

  const agreements = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  return res.status(200).json({
    agreements,
  });
}

/* -------------------------------------------------------
   CREATE AGREEMENT
------------------------------------------------------- */

async function createAgreement(req, res) {
  await requireAdmin(req);

  const { customerName, customerPhone, customerEmail, itemDescription, price } =
    req.body;

  if (!customerName || !customerPhone || !itemDescription) {
    return res.status(400).json({
      message:
        "Customer name, customer phone, and item description are required.",
    });
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({
      message: "A valid price is required.",
    });
  }

  const payment = calculatePaymentAmounts(numericPrice);

  const agreementToken = createAgreementToken();

  const now = new Date().toISOString();

  const agreement = {
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail?.trim() || "",

    itemDescription: itemDescription.trim(),

    price: numericPrice,

    upfrontPercentage: payment.upfrontPercentage,
    upfrontAmount: payment.upfrontAmount,

    balancePercentage: payment.balancePercentage,
    balanceAmount: payment.balanceAmount,

    agreementToken,

    status: "pending",

    acceptedAt: null,
    rejectedAt: null,

    createdAt: now,
    updatedAt: now,
  };

  const documentRef = await adminDb.collection("agreements").add(agreement);

  return res.status(201).json({
    message: "Agreement created successfully.",
    id: documentRef.id,
    agreement: {
      id: documentRef.id,
      ...agreement,
    },
  });
}

/* -------------------------------------------------------
   UPDATE AGREEMENT
------------------------------------------------------- */

async function updateAgreement(req, res) {
  await requireAdmin(req);

  const {
    id,
    customerName,
    customerPhone,
    customerEmail,
    itemDescription,
    price,
  } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Agreement ID is required.",
    });
  }

  const agreementRef = adminDb.collection("agreements").doc(id);

  const existing = await agreementRef.get();

  if (!existing.exists) {
    return res.status(404).json({
      message: "Agreement not found.",
    });
  }

  const existingData = existing.data();

  const updates = {
    updatedAt: new Date().toISOString(),
  };

  if (customerName !== undefined) {
    updates.customerName = customerName.trim();
  }

  if (customerPhone !== undefined) {
    updates.customerPhone = customerPhone.trim();
  }

  if (customerEmail !== undefined) {
    updates.customerEmail = customerEmail.trim();
  }

  if (itemDescription !== undefined) {
    updates.itemDescription = itemDescription.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        message: "A valid price is required.",
      });
    }

    const payment = calculatePaymentAmounts(numericPrice);

    updates.price = numericPrice;
    updates.upfrontPercentage = payment.upfrontPercentage;
    updates.upfrontAmount = payment.upfrontAmount;
    updates.balancePercentage = payment.balancePercentage;
    updates.balanceAmount = payment.balanceAmount;
  }

  await agreementRef.update(updates);

  return res.status(200).json({
    message: "Agreement updated successfully.",
    id,
    agreement: {
      id,
      ...existingData,
      ...updates,
    },
  });
}

/* -------------------------------------------------------
   CUSTOMER RESPONSE
------------------------------------------------------- */

async function respondToAgreement(req, res) {
  const { token, status } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Agreement token is required.",
    });
  }

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Invalid agreement response.",
    });
  }

  const snapshot = await adminDb
    .collection("agreements")
    .where("agreementToken", "==", token)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return res.status(404).json({
      message: "Agreement not found.",
    });
  }

  const document = snapshot.docs[0];
  const agreement = document.data();

  /*
    Prevent changing an already completed agreement.
  */

  if (agreement.status !== "pending") {
    return res.status(400).json({
      message: `This agreement has already been ${agreement.status}.`,
    });
  }

  const now = new Date().toISOString();

  const updates = {
    status,
    updatedAt: now,
  };

  if (status === "accepted") {
    updates.acceptedAt = now;
    updates.rejectedAt = null;
  }

  if (status === "rejected") {
    updates.rejectedAt = now;
    updates.acceptedAt = null;
  }

  await document.ref.update(updates);

  return res.status(200).json({
    message:
      status === "accepted"
        ? "Agreement accepted successfully."
        : "Agreement rejected successfully.",
    status,
    agreementId: document.id,
  });
}

/* -------------------------------------------------------
   DELETE AGREEMENT
------------------------------------------------------- */

async function deleteAgreement(req, res) {
  await requireAdmin(req);

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Agreement ID is required.",
    });
  }

  const agreementRef = adminDb.collection("agreements").doc(id);

  const existing = await agreementRef.get();

  if (!existing.exists) {
    return res.status(404).json({
      message: "Agreement not found.",
    });
  }

  await agreementRef.delete();

  return res.status(200).json({
    message: "Agreement deleted successfully.",
  });
}

/* -------------------------------------------------------
   MAIN API HANDLER
------------------------------------------------------- */

export default async function handler(req, res) {
  try {
    /*
      GET is special because customers can access an agreement
      using their unique token without Firebase authentication.
    */

    if (req.method === "GET") {
      return await getAgreements(req, res);
    }

    if (req.method === "POST") {
      return await createAgreement(req, res);
    }

    if (req.method === "PUT") {
      return await updateAgreement(req, res);
    }

    if (req.method === "PATCH") {
      return await respondToAgreement(req, res);
    }

    if (req.method === "DELETE") {
      return await deleteAgreement(req, res);
    }

    return res.status(405).json({
      message: "Method not allowed.",
    });
  } catch (error) {
    console.error("AGREEMENTS API ERROR:", error);

    const status = error.status || 500;

    return res.status(status).json({
      message:
        status === 500
          ? "Something went wrong while processing the agreement."
          : error.message,
    });
  }
}
