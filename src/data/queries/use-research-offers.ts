import { getResearchOffers } from "../api/research-offers";
import { queryKeys } from "../query-keys";
import { createQueryHookWithParams } from "./types";

export const useResearchOffers = createQueryHookWithParams(
  queryKeys.researchOffers.all,
  getResearchOffers,
);
