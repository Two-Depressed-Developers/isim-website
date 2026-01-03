import { getResearchOffers } from "../api/research-offers";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";
import type { ResearchOffer } from "@/types/strapi";

export const useResearchOffers = createQueryHook<ResearchOffer[]>(
  queryKeys.researchOffers.all,
  getResearchOffers,
);
