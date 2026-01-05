import { getGroupsData } from "../api/groups";
import { queryKeys } from "../query-keys";
import { createQueryHookWithParams } from "./types";

export const useGroupsData = createQueryHookWithParams(
  queryKeys.groups.all,
  getGroupsData,
);
