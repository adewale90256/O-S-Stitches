import { sanityClient } from "./sanity";
import { urlFor } from "./sanityImage";

export async function getCatalogueItems() {
  const query = `
    *[_type == "catalogue"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      priceType,
      price,
      featured,
      available,
      image,
      gallery
    }
  `;

  const items = await sanityClient.fetch(query);

  return items.map((item) => ({
    ...item,
    id: item._id,
    slug: item.slug?.current || "",
    image: item.image ? urlFor(item.image).width(1200).quality(85).url() : "",
  }));
}

export async function getCatalogueItemById(id) {
  const query = `
    *[_type == "catalogue" && _id == $id][0] {
      _id,
      title,
      slug,
      category,
      description,
      priceType,
      price,
      featured,
      available,
      image,
      gallery
    }
  `;

  const item = await sanityClient.fetch(query, { id });

  if (!item) {
    throw new Error("Catalogue item not found.");
  }

  return {
    ...item,
    id: item._id,
    image: item.image ? urlFor(item.image).width(1200).quality(85).url() : "",
  };
}

export async function getCatalogueItemBySlug(slug) {
  const query = `
    *[_type == "catalogue" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      description,
      priceType,
      price,
      featured,
      available,
      image,
      gallery
    }
  `;

  const item = await sanityClient.fetch(query, { slug });

  if (!item) {
    throw new Error("Catalogue item not found.");
  }

  return {
    ...item,
    id: item._id,
    slug: item.slug?.current || "",
    image: item.image ? urlFor(item.image).width(1200).quality(85).url() : "",
    gallery: (item.gallery || []).map((image) =>
      urlFor(image).width(1200).quality(85).url(),
    ),
  };
}

export async function updateCatalogueItem(
  id,
  data,
  imageFile,
  galleryFiles,
  existingGallery = [],
) {
  const headers = await getAuthHeaders();

  const formData = new FormData();

  formData.append("id", id);
  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("description", data.description || "");
  formData.append("priceType", data.priceType || "on-request");
  formData.append("price", data.price ?? "");
  formData.append("featured", String(data.featured ?? false));
  formData.append("available", String(data.available ?? true));
  formData.append("existingGallery", JSON.stringify(existingGallery));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  galleryFiles.forEach((file) => {
    formData.append("gallery", file);
  });

  const response = await fetch("/api/catalogue", {
    method: "PUT",
    headers,
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update catalogue item.");
  }

  return result;
}

async function getAuthHeaders() {
  const { auth } = await import("./firebase");

  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createCatalogueItem(data, imageFile, galleryFiles) {
  const headers = await getAuthHeaders();

  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("description", data.description || "");
  formData.append("priceType", data.priceType || "on-request");
  formData.append("price", data.price ?? "");
  formData.append("featured", String(data.featured ?? false));
  formData.append("available", String(data.available ?? true));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  galleryFiles.forEach((file) => {
    formData.append("gallery", file);
  });

  const response = await fetch("/api/catalogue", {
    method: "POST",
    headers,
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to create catalogue item.");
  }

  return result;
}

export async function deleteCatalogueItem(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/catalogue?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to delete catalogue item.");
  }

  return result;
}
