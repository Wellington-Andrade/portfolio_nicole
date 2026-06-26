import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2026-06-26";

export const hasSanityConfig = Boolean(projectId && dataset);

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const imageBuilder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export function urlFor(source) {
  if (!imageBuilder || !source) return null;
  return imageBuilder.image(source);
}

export async function getArtworks() {
  if (!sanityClient) return [];

  return sanityClient.fetch(`
    *[_type == "artwork" && published == true]
      | order(coalesce(order, 0) asc, _createdAt desc) {
        _id,
        name,
        image,
        order
      }
  `);
}
