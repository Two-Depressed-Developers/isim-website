import { getGroupsData } from "../api/groups";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHookWithParams } from "./types";

export const useGroupsData = createSuspenseQueryHookWithParams(
  queryKeys.groups.all,
  getGroupsData,
);

export const useResearchGroupsData = createSuspenseQueryHookWithParams(
  (locale: string, onlyResearch: boolean) =>
    queryKeys.groups.researchGroups(locale, onlyResearch),
  getGroupsData,
);
