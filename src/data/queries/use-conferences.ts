import { getConferences } from "../api/conferences";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHook } from "./types";
import type { Conference } from "@/types";

export const useConferences = createSuspenseQueryHook<Conference[]>(
  queryKeys.conferences.all,
  getConferences,
);
