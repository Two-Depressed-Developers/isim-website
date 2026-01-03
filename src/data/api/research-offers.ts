import qs from "qs";
import type { ResearchOffer } from "@/types/strapi";
import { baseAPIUrl, fetchData } from "./base";

export async function getResearchOffers(): Promise<ResearchOffer[]> {
  const url = new URL("/api/research-offers", baseAPIUrl);

  url.search = qs.stringify({
    populate: {
      offerSections: {
        populate: {
          features: true,
        },
      },
    },
  });

  const response = await fetchData(url.href);

  return response?.data ?? [];
}
