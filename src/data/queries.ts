import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroupsData } from "./loaders/groups";
import {
  getMemberData,
  getMemberSchema,
  updateMember,
} from "./loaders/members";
import { getCalendarEvents } from "./loaders/calendar";
import {
  getClassroomResources,
  uploadClassroomResources,
} from "./loaders/classrooms";
import { MemberData } from "@/lib/types";
import type { ClassroomResource } from "@/lib/classroom-utils";

export const queryKeys = {
  groups: ["groups"] as const,
  member: (slug: string) => ["member", slug] as const,
  memberSchema: ["member-schema"] as const,
  calendarEvents: ["calendar-events"] as const,
  classroomResources: ["classroom-resources"] as const,
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

export function useClassroomResources() {
  return useQuery({
    queryKey: queryKeys.classroomResources,
    queryFn: () => getClassroomResources(),
  });
}

export function useUploadClassroomResources() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      accessToken,
    }: {
      data: ClassroomResource[];
      accessToken: string;
    }) => uploadClassroomResources(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.classroomResources,
      });
    },
  });
}
