import { getResearchOffers } from "../api/research-offers";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHook } from "./types";
import type { ResearchOffer } from "@/types";

export const useResearchOffers = createSuspenseQueryHook<ResearchOffer[]>(
  queryKeys.researchOffers.all,
  getResearchOffers,
);
