import { getJournals } from "../api/journals";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHook } from "./types";
import type { Journal } from "@/types";

export const useJournals = createSuspenseQueryHook<Journal[]>(
  queryKeys.journals.all,
  getJournals,
);
