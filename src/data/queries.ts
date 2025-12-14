import { useQuery } from "@tanstack/react-query";
import { getCalendarEvents, getGroupsData, getMemberData } from "./loaders";

export const queryKeys = {
  groups: ["groups"] as const,
  member: (slug: string) => ["member", slug] as const,
  calendarEvents: ["calendar-events"] as const,
};

export function useGroupsData() {
  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: getGroupsData,
  });
}

export function useMemberData(slug: string) {
  return useQuery({
    queryKey: queryKeys.member(slug),
    queryFn: () => getMemberData(slug),
    enabled: !!slug,
  });
}

export function useCalendarEvents() {
  return useQuery({
    queryKey: queryKeys.calendarEvents,
    queryFn: () => getCalendarEvents(),
  });
}
