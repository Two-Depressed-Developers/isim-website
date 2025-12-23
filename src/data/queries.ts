import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCalendarEvents,
  getGroupsData,
  getMemberData,
  getMemberSchema,
  updateMember,
} from "./loaders";
import { MemberData } from "@/lib/types";

export const queryKeys = {
  groups: ["groups"] as const,
  member: (slug: string) => ["member", slug] as const,
  memberSchema: ["member-schema"] as const,
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

export function useMemberSchema() {
  return useQuery({
    queryKey: queryKeys.memberSchema,
    queryFn: getMemberSchema,
  });
}

export function useUpdateMember(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
      accessToken,
    }: {
      documentId: string;
      data: Partial<MemberData>;
      accessToken: string;
    }) => updateMember(documentId, data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member(slug) });
    },
  });
}

export function useCalendarEvents() {
  return useQuery({
    queryKey: queryKeys.calendarEvents,
    queryFn: () => getCalendarEvents(),
  });
}
