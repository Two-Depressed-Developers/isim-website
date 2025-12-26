import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCalendarEvents,
  getGroupsData,
  getMemberData,
  getTicketById,
  getTickets,
  submitTicket,
  updateTicketStatus,
  verifyTicket,
  getMemberSchema,
  updateMember,
  bookConsultation,
  getMemberConsultationBookings,
  updateConsultationBookingStatus,
} from "./loaders";
import type { TicketStatus } from "@/lib/types";
import { MemberData } from "@/lib/types";

export const queryKeys = {
  groups: ["groups"] as const,
  member: (slug: string) => ["member", slug] as const,
  memberSchema: ["member-schema"] as const,
  calendarEvents: ["calendar-events"] as const,
  tickets: ["tickets"] as const,
  ticketDetails: (id: string, token: string) => ["ticket", id, token] as const,
  verifyTicket: (token: string) => ["verify-ticket", token] as const,
  consultationBookings: (memberDocumentId: string) =>
    ["consultation-bookings", memberDocumentId] as const,
};

export function useGroupsData() {
  return useQuery({
    queryKey: queryKeys.groups,
    queryFn: getGroupsData,
  });
}

export function useMemberData(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.member(slug),
    queryFn: () => getMemberData(slug),
    enabled: options?.enabled !== undefined ? options.enabled : !!slug,
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

export function useBookConsultation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.member(slug),
      });
    },
  });
}

export function useConsultationBookings(
  memberDocumentId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.consultationBookings(memberDocumentId),
    queryFn: () => getMemberConsultationBookings(memberDocumentId),
    enabled:
      options?.enabled !== undefined ? options.enabled : !!memberDocumentId,
  });
}

export function useUpdateConsultationBookingStatus(memberDocumentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      status,
      accessToken,
      emailData,
    }: {
      documentId: string;
      status: "accepted" | "declined";
      accessToken: string;
      emailData: {
        email: string;
        studentName: string;
        memberName: string;
        startTime: string;
        endTime: string;
        room?: string;
      };
    }) =>
      updateConsultationBookingStatus(
        documentId,
        status,
        accessToken,
        emailData,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultationBookings(memberDocumentId),
      });
    },
  });
}
