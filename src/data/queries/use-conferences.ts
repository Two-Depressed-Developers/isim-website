import { getConferences } from "../api/conferences";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHookWithParams } from "./types";
import type { Conference } from "@/types";

export const useConferences = createSuspenseQueryHookWithParams<
  Conference[],
  [string]
>(queryKeys.conferences.all, getConferences);
