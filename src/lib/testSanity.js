import { sanityClient } from "./sanity";

export async function testSanityConnection() {
  const result = await sanityClient.fetch(`
    *[_type == "portfolio"]{
      _id,
      title,
      category
    }
  `);

  console.log("SANITY PORTFOLIO DATA:", result);

  return result;
}
