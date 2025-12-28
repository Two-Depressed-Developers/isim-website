import { getGroupsData } from "../api/groups";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";

export const useGroupsData = createQueryHook(
  queryKeys.groups.all,
  getGroupsData,
);
