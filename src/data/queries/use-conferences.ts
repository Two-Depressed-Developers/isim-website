import { getConferences } from "../api/conferences";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";
import type { Conference } from "@/lib/types";

export const useConferences = createQueryHook<Conference[]>(
  queryKeys.conferences.all,
  getConferences,
);
