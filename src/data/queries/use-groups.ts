import { getGroupsData } from "../api/groups";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHook } from "./types";

export const useGroupsData = createSuspenseQueryHook(
  queryKeys.groups.all,
  getGroupsData,
);
