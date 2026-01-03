import qs from "qs";
import type { ResearchOffer, StrapiCollectionResponse } from "@/types";
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

  const response = await fetchData<StrapiCollectionResponse<ResearchOffer>>(
    url.href,
  );

  return response?.data ?? [];
}
