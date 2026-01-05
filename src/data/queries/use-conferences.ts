import { getConferences } from "../api/conferences";
import { queryKeys } from "../query-keys";
import { createQueryHookWithParams } from "./types";

export const useConferences = createQueryHookWithParams(
  queryKeys.conferences.all,
  getConferences,
);
