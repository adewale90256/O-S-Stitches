import formidable from "formidable";
import fs from "fs";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

import { createClient } from "@sanity/client";

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
   SANITY WRITE CLIENT
------------------------------------------------------- */

const sanityWriteClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || "2026-09-13",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

/* -------------------------------------------------------
   VERCEL CONFIG
------------------------------------------------------- */

export const config = {
  api: {
    bodyParser: false,
  },
};

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function getField(value) {
  return Array.isArray(value) ? value[0] : value;
}

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
   PARSE MULTIPART FORM
------------------------------------------------------- */

async function parseForm(req) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  const [fields, files] = await form.parse(req);

  return {
    fields,
    files,
  };
}

/* -------------------------------------------------------
   CREATE PORTFOLIO ITEM
------------------------------------------------------- */

async function createPortfolio(req, res) {
  const { fields, files } = await parseForm(req);

  const title = getField(fields.title);
  const category = getField(fields.category);
  const description = getField(fields.description);
  const priceType = getField(fields.priceType);
  const price = getField(fields.price);
  const featured = getField(fields.featured);

  if (!title || !category) {
    return res.status(400).json({
      message: "Title and category are required.",
    });
  }

  const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

  if (!imageFile) {
    return res.status(400).json({
      message: "A portfolio image is required.",
    });
  }

  /* Upload image to Sanity */

  const imageAsset = await sanityWriteClient.assets.upload(
    "image",
    fs.createReadStream(imageFile.filepath),
    {
      filename: imageFile.originalFilename || "portfolio-image",
      contentType: imageFile.mimetype || undefined,
    },
  );

  /* Create Sanity document */

  const document = {
    _type: "portfolio",
    title: title.trim(),
    slug: {
      _type: "slug",
      current: slugify(title),
    },
    category,
    description: description?.trim() || "",
    priceType: priceType || "fixed",
    featured: featured === "true",
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    },
  };

  if (priceType !== "on-request" && price !== "") {
    document.price = Number(price);
  }

  const created = await sanityWriteClient.create(document);

  return res.status(201).json({
    message: "Portfolio item created successfully.",
    id: created._id,
  });
}

/* -------------------------------------------------------
   UPDATE PORTFOLIO ITEM
------------------------------------------------------- */

async function updatePortfolio(req, res) {
  const { fields, files } = await parseForm(req);

  const id = getField(fields.id);
  const title = getField(fields.title);
  const category = getField(fields.category);
  const description = getField(fields.description);
  const priceType = getField(fields.priceType);
  const price = getField(fields.price);
  const featured = getField(fields.featured);

  if (!id) {
    return res.status(400).json({
      message: "Portfolio ID is required.",
    });
  }

  const patchData = {
    title: title?.trim() || "",
    category,
    description: description?.trim() || "",
    priceType: priceType || "fixed",
    featured: featured === "true",
  };

  // Update slug when title changes
  if (title) {
    patchData.slug = {
      _type: "slug",
      current: slugify(title),
    };
  }

  // Handle price separately
  if (priceType !== "on-request" && price !== "") {
    patchData.price = Number(price);
  }

  // Upload a new image only if one was selected
  const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

  if (imageFile) {
    const imageAsset = await sanityWriteClient.assets.upload(
      "image",
      fs.createReadStream(imageFile.filepath),
      {
        filename: imageFile.originalFilename || "portfolio-image",
        contentType: imageFile.mimetype || undefined,
      },
    );

    patchData.image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAsset._id,
      },
    };
  }

  let patch = sanityWriteClient.patch(id).set(patchData);

  // Remove price completely when "On Request" is selected
  if (priceType === "on-request" || price === "") {
    patch = patch.unset(["price"]);
  }

  const updated = await patch.commit();

  return res.status(200).json({
    message: "Portfolio item updated successfully.",
    id: updated._id,
  });
}

/* -------------------------------------------------------
   DELETE PORTFOLIO ITEM
------------------------------------------------------- */

async function deletePortfolio(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Portfolio ID is required.",
    });
  }

  await sanityWriteClient.delete(id);

  return res.status(200).json({
    message: "Portfolio item deleted successfully.",
  });
}

/* -------------------------------------------------------
   MAIN API HANDLER
------------------------------------------------------- */

export default async function handler(req, res) {
  try {
    /* Every portfolio mutation requires an authenticated admin */

    await requireAdmin(req);

    if (req.method === "POST") {
      return await createPortfolio(req, res);
    }

    if (req.method === "PUT") {
      return await updatePortfolio(req, res);
    }

    if (req.method === "DELETE") {
      return await deletePortfolio(req, res);
    }

    return res.status(405).json({
      message: "Method not allowed.",
    });
  } catch (error) {
    console.error("PORTFOLIO API ERROR:", error);

    const status = error.status || 500;

    return res.status(status).json({
      message:
        status === 500
          ? "Something went wrong while processing the portfolio."
          : error.message,
    });
  }
}
