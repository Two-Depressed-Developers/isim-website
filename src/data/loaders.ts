import qs from "qs";
import axios from "axios";

import { getStrapiURL, flattenAttributes } from "@/lib/utils";
import type {
  CalendarEvent,
  GroupData,
  MemberData,
  Ticket,
  TicketFormData,
  TicketStatus,
  ConsultationBookingFormData,
  ConsultationBooking,
} from "@/lib/types";

const baseAPIUrl = getStrapiURL();

const api = axios.create({
  baseURL: baseAPIUrl,
});

export async function fetchData(url: string) {
  const response = await api.get(url);

  return flattenAttributes(response.data);
}

export async function uploadFile(
  file: File,
  accessToken: string,
  linkOptions?: {
    ref: string;
    refId: string;
    field: string;
  },
): Promise<{ id: number; documentId: string; url: string }> {
  const formData = new FormData();
  formData.append("files", file);

  if (linkOptions) {
    formData.append("ref", linkOptions.ref);
    formData.append("refId", linkOptions.refId);
    formData.append("field", linkOptions.field);
  }

  const response = await axios.post(`${baseAPIUrl}/api/upload`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data[0];
}

export async function getGroupsData(): Promise<GroupData> {
  const url = new URL("/api/groups", baseAPIUrl);

  const populateOptions = {
    fields: ["fullName", "slug", "title", "phone", "email", "position"],
    populate: {
      photo: {
        fields: ["url", "alternativeText"],
      },
      USOSLink: {
        populate: true,
      },
      BADAPLink: {
        populate: true,
      },
      SKOSLink: {
        populate: true,
      },
    },
  };

  url.search = qs.stringify({
    populate: {
      link: true,
      supervisor: populateOptions,
      members: populateOptions,
    },
  });

  return await fetchData(url.href);
}

export async function getMemberData(slug: string): Promise<MemberData> {
  const url = new URL(`/api/members`, baseAPIUrl);

  const populateOptions = {
    fields: ["fullName", "slug", "title", "phone", "email", "room", "position"],
    photo: {
      fields: ["url", "alternativeText"],
    },
    USOSLink: {
      populate: true,
    },
    BADAPLink: {
      populate: true,
    },
    SKOSLink: {
      populate: true,
    },
    PortfolioLink: {
      populate: true,
    },
    consultationAvailability: {
      populate: true,
      filters: {
        isActive: {
          $eq: true,
        },
      },
    },
    sections: true,
  };

  url.search = qs.stringify({
    populate: populateOptions,
    filters: {
      slug: slug,
    },
  });

  const response = await fetchData(url.href);

  return response?.data?.[0] ?? ({ error: true } as MemberData);
}

export async function getMemberSchema(): Promise<Record<string, unknown>> {
  const contentTypeId = "api::member.member";
  const url = new URL(`/api/schemas/${contentTypeId}`, baseAPIUrl);

  return await fetchData(url.href);
}

export async function updateMember(
  documentId: string,
  data: Partial<MemberData>,
  accessToken: string,
): Promise<MemberData> {
  try {
    const response = await axios.put(
      `${baseAPIUrl}/api/members/${documentId}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return flattenAttributes(response.data);
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const url = new URL("/api/calendar-events", baseAPIUrl);

  const populateOptions = {
    fields: ["title", "startDate", "endDate", "description", "color"],
  };

  url.search = qs.stringify({
    populate: populateOptions,
  });

  const response = await fetchData(url.href);

  return response?.data ?? [];
}

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

export async function getTickets(): Promise<Ticket[]> {
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

  const response = await fetchData(url.href);
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

export async function bookConsultation(
  data: ConsultationBookingFormData,
): Promise<void> {
  try {
    await api.post(`${baseAPIUrl}/api/consultation-bookings`, {
      data: {
        studentEmail: data.studentEmail,
        studentName: data.studentName,
        fieldAndSubject: data.fieldAndSubject,
        startTime: data.startTime,
        endTime: data.endTime,
        member: data.memberDocumentId,
        reservationStatus: "pending",
      },
    });
  } catch (error) {
    console.error("Error booking consultation:", error);
    throw error;
  }
}

export async function getMemberConsultationBookings(
  memberDocumentId: string,
): Promise<ConsultationBooking[]> {
  try {
    const url = new URL("/api/consultation-bookings", baseAPIUrl);

    url.search = qs.stringify({
      filters: {
        member: {
          documentId: {
            $eq: memberDocumentId,
          },
        },
      },
      sort: ["startTime:asc"],
      populate: {
        member: {
          fields: ["fullName", "documentId"],
        },
      },
    });

    const response = await fetchData(url.href);
    return response?.data ?? [];
  } catch (error) {
    console.error("Error fetching consultation bookings:", error);
    throw error;
  }
}

export async function updateConsultationBookingStatus(
  documentId: string,
  status: "accepted" | "declined",
  accessToken: string,
  emailData: {
    email: string;
    studentName: string;
    memberName: string;
    startTime: string;
    endTime: string;
    room?: string;
  },
): Promise<ConsultationBooking> {
  try {
    const url = new URL(`/api/consultation-bookings/${documentId}`, baseAPIUrl);

    url.search = qs.stringify({
      populate: {
        member: {
          fields: ["fullName", "documentId", "room"],
        },
      },
    });

    const response = await axios.put(
      url.href,
      {
        data: {
          reservationStatus: status,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    await axios.post("/api/consultations/send-status-update", {
      ...emailData,
      status,
    });

    return flattenAttributes(response.data);
  } catch (error) {
    console.error("Error updating consultation booking:", error);
    throw error;
  }
}
