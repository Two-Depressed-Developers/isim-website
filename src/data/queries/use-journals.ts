import { getJournals } from "../api/journals";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";
import type { Journal } from "@/types";

export const useJournals = createQueryHook<Journal[]>(
  queryKeys.journals.all,
  getJournals,
);
