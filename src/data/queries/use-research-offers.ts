import { getResearchOffers } from "../api/research-offers";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHookWithParams } from "./types";
import type { ResearchOffer } from "@/types";

export const useResearchOffers = createSuspenseQueryHookWithParams<
  ResearchOffer[],
  [string]
>(queryKeys.researchOffers.all, getResearchOffers);
