import { getJournals } from "../api/journals";
import { queryKeys } from "../query-keys";
import { createQueryHookWithParams } from "./types";

export const useJournals = createQueryHookWithParams(
  queryKeys.journals.all,
  getJournals,
);
