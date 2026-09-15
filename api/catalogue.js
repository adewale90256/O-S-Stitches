import formidable from "formidable";
import fs from "fs";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

import { createClient } from "@sanity/client";
import crypto from "crypto";
import process from "node:process";

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

function getFiles(value) {
  if (!value) return [];

  return Array.isArray(value) ? value : [value];
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
    multiples: true,
    keepExtensions: true,
  });

  const [fields, files] = await form.parse(req);

  return {
    fields,
    files,
  };
}

/* -------------------------------------------------------
   CREATE CATALOGUE ITEM
------------------------------------------------------- */

async function createCatalogue(req, res) {
  const { fields, files } = await parseForm(req);

  const title = getField(fields.title);
  const category = getField(fields.category);
  const description = getField(fields.description);
  const priceType = getField(fields.priceType);
  const price = getField(fields.price);
  const featured = getField(fields.featured);
  const available = getField(fields.available);

  if (!title || !category) {
    return res.status(400).json({
      message: "Title and category are required.",
    });
  }

  /* -----------------------------------------------------
     MAIN IMAGE
  ----------------------------------------------------- */

  const mainImageFile = getFiles(files.image)[0];

  if (!mainImageFile) {
    return res.status(400).json({
      message: "A main catalogue image is required.",
    });
  }

  const mainImageAsset = await sanityWriteClient.assets.upload(
    "image",
    fs.createReadStream(mainImageFile.filepath),
    {
      filename: mainImageFile.originalFilename || "catalogue-image",
      contentType: mainImageFile.mimetype || undefined,
    },
  );

  /* -----------------------------------------------------
     CREATE DOCUMENT
  ----------------------------------------------------- */

  const document = {
    _type: "catalogue",

    title: title.trim(),

    slug: {
      _type: "slug",
      current: slugify(title),
    },

    category,

    description: description?.trim() || "",

    priceType: priceType || "on-request",

    featured: featured === "true",

    available: available !== "false",

    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: mainImageAsset._id,
      },
    },
  };

  /* -----------------------------------------------------
     PRICE
  ----------------------------------------------------- */

  if (priceType !== "on-request" && price !== "") {
    document.price = Number(price);
  }

  /* -----------------------------------------------------
     GALLERY IMAGES
  ----------------------------------------------------- */

  const galleryFiles = getFiles(files.gallery);

  if (galleryFiles.length > 0) {
    const galleryImages = [];

    for (const galleryFile of galleryFiles) {
      const galleryAsset = await sanityWriteClient.assets.upload(
        "image",
        fs.createReadStream(galleryFile.filepath),
        {
          filename: galleryFile.originalFilename || "catalogue-gallery-image",
          contentType: galleryFile.mimetype || undefined,
        },
      );

      galleryImages.push({
        _type: "image",
        _key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        asset: {
          _type: "reference",
          _ref: galleryAsset._id,
        },
      });
    }

    document.gallery = galleryImages;
  }

  /* -----------------------------------------------------
     CREATE SANITY DOCUMENT
  ----------------------------------------------------- */

  const created = await sanityWriteClient.create(document);

  return res.status(201).json({
    message: "Catalogue item created successfully.",
    id: created._id,
  });
}

/* -------------------------------------------------------
   DELETE CATALOGUE ITEM
------------------------------------------------------- */

async function deleteCatalogue(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Catalogue ID is required.",
    });
  }

  await sanityWriteClient.delete(id);

  return res.status(200).json({
    message: "Catalogue item deleted successfully.",
  });
}

async function updateCatalogue(req, res) {
  const { fields, files } = await parseForm(req);

  const id = getField(fields.id);

  if (!id) {
    return res.status(400).json({
      message: "Catalogue ID is required.",
    });
  }

  const title = getField(fields.title);
  const category = getField(fields.category);
  const description = getField(fields.description);
  const priceType = getField(fields.priceType) || "on-request";
  const priceValue = getField(fields.price);
  const featured = getField(fields.featured) === "true";
  const available = getField(fields.available) !== "false";
  const existingGalleryValue = getField(fields.existingGallery);

  let existingGallery = [];

  if (existingGalleryValue) {
    try {
      existingGallery = JSON.parse(existingGalleryValue).map((image) => ({
        ...image,
        _key: image._key || crypto.randomUUID(),
      }));
    } catch {
      return res.status(400).json({
        message: "Invalid existing gallery data.",
      });
    }
  }

  if (!title || !category) {
    return res.status(400).json({
      message: "Title and category are required.",
    });
  }

  const updateData = {
    title,
    slug: {
      _type: "slug",
      current: slugify(title),
    },
    category,
    description,
    priceType,
    featured,
    available,
  };

  if (priceValue !== "" && priceValue != null) {
    updateData.price = Number(priceValue);
  } else {
    updateData.price = undefined;
  }

  const imageFile = getFiles(files.image)[0];

  if (imageFile) {
    const uploadedImage = await sanityWriteClient.assets.upload(
      "image",
      fs.createReadStream(imageFile.filepath),
      {
        filename: imageFile.originalFilename,
      },
    );

    updateData.image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: uploadedImage._id,
      },
    };
  }

  const galleryFiles = getFiles(files.gallery);

  const galleryAssets = [];

  for (const file of galleryFiles) {
    const uploadedImage = await sanityWriteClient.assets.upload(
      "image",
      fs.createReadStream(file.filepath),
      {
        filename: file.originalFilename,
      },
    );

    galleryAssets.push({
      _key: crypto.randomUUID(),
      _type: "image",
      asset: {
        _type: "reference",
        _ref: uploadedImage._id,
      },
    });
  }

  updateData.gallery = [...existingGallery, ...galleryAssets];

  await sanityWriteClient.patch(id).set(updateData).commit();

  return res.status(200).json({
    message: "Catalogue item updated successfully.",
  });
}

/* -------------------------------------------------------
   MAIN API HANDLER
------------------------------------------------------- */

export default async function handler(req, res) {
  try {
    await requireAdmin(req);

    if (req.method === "POST") {
      return await createCatalogue(req, res);
    }

    if (req.method === "PUT") {
      return await updateCatalogue(req, res);
    }

    if (req.method === "DELETE") {
      return await deleteCatalogue(req, res);
    }

    return res.status(405).json({
      message: "Method not allowed.",
    });
  } catch (error) {
    console.error("Catalogue API error:", error);

    return res.status(500).json({
      message: error.message || "Something went wrong.",
    });
  }
}
