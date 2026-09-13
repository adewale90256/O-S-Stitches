import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const portfolioCollection = collection(db, "portfolio");

export async function getPortfolioItems() {
  console.log("Getting portfolio items...");

  const q = query(portfolioCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  console.log("Portfolio items loaded:", snapshot.size);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function createPortfolioItem(data) {
  console.log("Creating portfolio item...");
  console.log("Data:", data);
  console.log("About to send request to Firestore...");

  try {
    const firestoreRequest = addDoc(portfolioCollection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Firestore request timed out after 15 seconds."));
      }, 15000);
    });

    const documentRef = await Promise.race([firestoreRequest, timeout]);

    console.log("Portfolio item created:", documentRef.id);

    return documentRef.id;
  } catch (error) {
    console.error("FIRESTORE CREATE ERROR:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    throw error;
  }
}

export async function updatePortfolioItem(id, data) {
  console.log("Updating portfolio item:", id);

  const documentRef = doc(db, "portfolio", id);

  await updateDoc(documentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  console.log("Portfolio item updated successfully");
}

export async function deletePortfolioItem(id) {
  console.log("Deleting portfolio item:", id);

  const documentRef = doc(db, "portfolio", id);

  await deleteDoc(documentRef);

  console.log("Portfolio item deleted successfully");
}
