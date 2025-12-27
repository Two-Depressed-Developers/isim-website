import qs from "qs";
import axios from "axios";
import type { Ticket, TicketFormData, TicketStatus } from "@/lib/types";
import { fetchData, baseAPIUrl, api } from "./base";
import { flattenAttributes } from "@/lib/utils";

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function submitTicket(data: TicketFormData) {
  const token = generateToken();

  const response = await api.post("/api/tickets", {
    data: {
      title: data.title,
      description: data.description,
      email: data.email,
      ticketStatus: "pending",
      verificationToken: token,
    },
  });

  const ticketId = response.data.data.documentId;

  const emailResponse = await axios.post("/api/tickets/send-verification", {
    email: data.email,
    token: token,
    ticketId: ticketId,
  });

  return emailResponse.data;
}

export async function verifyTicket(token: string) {
  const response = await axios.post("/api/tickets/verify", { token });
  return response.data;
}

export async function getTickets(accessToken: string): Promise<Ticket[]> {
  const url = new URL("/api/tickets", baseAPIUrl);

  url.search = qs.stringify({
    fields: [
      "title",
      "description",
      "email",
      "ticketStatus",
      "verifiedAtTime",
      "createdAt",
      "updatedAt",
    ],
    filters: {
      ticketStatus: {
        $ne: "pending",
      },
    },
    sort: ["createdAt:desc"],
  });

  const response = await fetchData(url.href, accessToken);
  return response?.data ?? [];
}

export async function getTicketById(
  ticketId: string,
  token?: string,
): Promise<Ticket | null> {
  const url = new URL("/api/tickets", baseAPIUrl);

  const filters: any = {
    documentId: ticketId,
  };

  if (token) {
    filters.verificationToken = token;
  }

  url.search = qs.stringify({
    fields: [
      "title",
      "description",
      "email",
      "ticketStatus",
      "verificationToken",
      "verifiedAtTime",
      "createdAt",
      "updatedAt",
    ],
    filters,
  });

  const response = await fetchData(url.href);
  return response?.data?.[0] ?? null;
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus,
  email?: string,
) {
  const response = await api.put(`/api/tickets/${ticketId}`, {
    data: {
      ticketStatus: status,
    },
  });

  if (email && (status === "resolved" || status === "closed")) {
    await axios.post("/api/tickets/send-status-update", {
      email,
      status,
      ticketId,
    });
  }

  return flattenAttributes(response.data);
}
