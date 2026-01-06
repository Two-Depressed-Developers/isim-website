import { getJournals } from "../api/journals";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHookWithParams } from "./types";
import type { Journal } from "@/types";

export const useJournals = createSuspenseQueryHookWithParams<
  Journal[],
  [string]
>(queryKeys.journals.all, getJournals);
