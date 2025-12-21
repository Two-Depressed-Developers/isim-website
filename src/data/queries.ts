import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCalendarEvents,
  getGroupsData,
  getMemberData,
  submitTicket,
  verifyTicket,
} from "./loaders";

export const queryKeys = {
  groups: ["groups"] as const,
  member: (slug: string) => ["member", slug] as const,
  calendarEvents: ["calendar-events"] as const,
  tickets: ["tickets"] as const,
  verifyTicket: (token: string) => ["verify-ticket", token] as const,
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

export function useSubmitTicket() {
  return useMutation({
    mutationFn: submitTicket,
  });
}

export function useVerifyTicket(token: string | null) {
  return useQuery({
    queryKey: queryKeys.verifyTicket(token!),
    queryFn: () => verifyTicket(token!),
    enabled: !!token,
    retry: false,
  });
}
