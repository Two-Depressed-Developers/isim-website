import type { TicketStatus } from "@/lib/types";
import {
  getTicketById,
  getTickets,
  submitTicket,
  updateTicketStatus,
  verifyTicket,
} from "../api/tickets";
import { queryKeys } from "../query-keys";
import {
  createQueryHook,
  createQueryHookWithParams,
  createMutationHook,
  createMutationHookWithInvalidation,
} from "./types";

export function useSubmitTicket() {
  return createMutationHook(submitTicket)();
}

export const useVerifyTicket = createQueryHookWithParams(
  (token: string | null) => queryKeys.tickets.verify(token!),
  (token: string | null) => verifyTicket(token!),
  (token: string | null) => ({ enabled: !!token, retry: false }),
);

export const useTickets = createQueryHook(queryKeys.tickets.all, getTickets);

export const useTicketDetails = createQueryHookWithParams(
  (ticketId: string, token?: string | null) =>
    queryKeys.tickets.byId(ticketId, token || ""),
  (ticketId: string, token?: string | null) =>
    getTicketById(ticketId, token || undefined),
  (ticketId: string) => ({ enabled: !!ticketId, retry: false }),
);

export function useUpdateTicketStatus() {
  return createMutationHookWithInvalidation<
    unknown,
    {
      ticketId: string;
      status: TicketStatus;
      email?: string;
    }
  >(
    ({ ticketId, status, email }) =>
      updateTicketStatus(ticketId, status, email),
    queryKeys.tickets.all,
  )();
}
