import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCalendarEvents,
  getGroupsData,
  getMemberData,
  getTicketById,
  getTickets,
  submitTicket,
  updateTicketStatus,
  verifyTicket,
} from "./loaders";
import type { TicketStatus } from "@/lib/types";

export const queryKeys = {
  groups: ["groups"] as const,
  member: (slug: string) => ["member", slug] as const,
  calendarEvents: ["calendar-events"] as const,
  tickets: ["tickets"] as const,
  ticketDetails: (id: string, token: string) => ["ticket", id, token] as const,
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

export function useTickets() {
  return useQuery({
    queryKey: queryKeys.tickets,
    queryFn: getTickets,
  });
}

export function useTicketDetails(ticketId: string, token?: string | null) {
  return useQuery({
    queryKey: queryKeys.ticketDetails(ticketId, token || ""),
    queryFn: () => getTicketById(ticketId, token || undefined),
    enabled: !!ticketId,
    retry: false,
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
      email,
    }: {
      ticketId: string;
      status: TicketStatus;
      email?: string;
    }) => updateTicketStatus(ticketId, status, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}
