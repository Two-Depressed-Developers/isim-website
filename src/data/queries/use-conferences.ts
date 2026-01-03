import { getConferences } from "../api/conferences";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";
import type { Conference } from "@/types/strapi";

export const useConferences = createQueryHook<Conference[]>(
  queryKeys.conferences.all,
  getConferences,
);
