import { sanityClient } from "./sanity";

export async function getSanityPortfolioItems() {
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

  return await sanityClient.fetch(query);
}
