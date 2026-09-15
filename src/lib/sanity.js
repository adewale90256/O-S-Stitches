import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "fggmr7qt",
  dataset: "production",
  apiVersion: "2026-09-13",
  useCdn: true,
});
