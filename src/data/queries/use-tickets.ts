import type { TicketStatus } from "@/types/strapi";
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

export const useTickets = createQueryHookWithParams(
  (accessToken: string) => queryKeys.tickets.all(accessToken),
  (accessToken: string) => getTickets(accessToken),
  (accessToken: string) => ({ enabled: !!accessToken }),
);

export const useTicketDetails = createQueryHookWithParams(
  (ticketId: string, token?: string | null) =>
    queryKeys.tickets.byId(ticketId, token || ""),
  (ticketId: string, token?: string | null) =>
    getTicketById(ticketId, token || undefined),
  (ticketId: string) => ({ enabled: !!ticketId, retry: false }),
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
