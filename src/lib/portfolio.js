import { auth } from "./firebase";
import { sanityClient } from "./sanity";
import { urlFor } from "./sanityImage";

/* -------------------------------------------------------
   AUTHENTICATION
------------------------------------------------------- */

async function getAuthHeaders() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in as an admin.");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

/* -------------------------------------------------------
   GET PORTFOLIO ITEMS FROM SANITY
------------------------------------------------------- */

export async function getPortfolioItems() {
  const query = `
    *[_type == "portfolio"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      priceType,
      price,
      featured,
      image
    }
  `;

  const items = await sanityClient.fetch(query);

  return items.map((item) => ({
    ...item,

    // Keep the existing admin UI compatible
    id: item._id,

    // Convert Sanity image reference into a usable URL
    image: item.image ? urlFor(item.image).width(1200).quality(85).url() : "",
  }));
}

/* -------------------------------------------------------
   CREATE PORTFOLIO ITEM
------------------------------------------------------- */

export async function createPortfolioItem(data, imageFile) {
  const headers = await getAuthHeaders();

  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("description", data.description || "");
  formData.append("priceType", data.priceType || "fixed");
  formData.append("price", data.price ?? "");
  formData.append("featured", String(data.featured ?? false));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch("/api/portfolio", {
    method: "POST",
    headers,
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to create portfolio item.");
  }

  return result;
}

/* -------------------------------------------------------
   UPDATE PORTFOLIO ITEM
------------------------------------------------------- */

export async function updatePortfolioItem(id, data, imageFile) {
  const headers = await getAuthHeaders();

  const formData = new FormData();

  formData.append("id", id);
  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("description", data.description || "");
  formData.append("priceType", data.priceType || "fixed");
  formData.append("price", data.price ?? "");
  formData.append("featured", String(data.featured ?? false));

  // Only send image when the admin selected a new one
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch("/api/portfolio", {
    method: "PUT",
    headers,
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update portfolio item.");
  }

  return result;
}

/* -------------------------------------------------------
   DELETE PORTFOLIO ITEM
------------------------------------------------------- */

export async function deletePortfolioItem(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to delete portfolio item.");
  }

  return result;
}
