import type { TicketStatus } from "@/types";
import {
  getTicketById,
  getTickets,
  submitTicket,
  updateTicketStatus,
  verifyTicket,
} from "../api/tickets";
import { queryKeys } from "../query-keys";
import {
  createSuspenseQueryHookWithParams,
  createMutationHook,
  createMutationHookWithInvalidation,
} from "./types";

export function useSubmitTicket() {
  return createMutationHook(submitTicket)();
}

export const useVerifyTicket = createSuspenseQueryHookWithParams(
  (token: string | null) => queryKeys.tickets.verify(token!),
  (token: string | null) => verifyTicket(token!),
  () => ({ retry: false }),
);

export const useTickets = createSuspenseQueryHookWithParams(
  (accessToken: string) => queryKeys.tickets.all(accessToken),
  (accessToken: string) => getTickets(accessToken),
);

export const useTicketDetails = createSuspenseQueryHookWithParams(
  (ticketId: string, token?: string | null) =>
    queryKeys.tickets.byId(ticketId, token || ""),
  (ticketId: string, token?: string | null) =>
    getTicketById(ticketId, token || undefined),
  () => ({ retry: false }),
);

export function useUpdateTicketStatus(accessToken: string) {
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
    queryKeys.tickets.all(accessToken),
  )();
}
