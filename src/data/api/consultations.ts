import qs from "qs";
import axios from "axios";
import type {
  ConsultationBooking,
  ConsultationBookingFormData,
  StrapiCollectionResponse,
} from "@/types";
import { fetchData, baseAPIUrl, api } from "./base";
import { flattenAttributes } from "@/lib/utils";

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function bookConsultation(
  data: ConsultationBookingFormData,
): Promise<void> {
  try {
    const token = generateToken();

    const response = await api.post(`${baseAPIUrl}/api/consultation-bookings`, {
      data: {
        studentEmail: data.studentEmail,
        studentName: data.studentName,
        fieldAndSubject: data.fieldAndSubject,
        startTime: data.startTime,
        endTime: data.endTime,
        member: data.memberDocumentId,
        reservationStatus: "unverified",
        verificationToken: token,
      },
    });

    const bookingId = response.data.data.documentId;

    await axios.post("/api/consultations/send-verification", {
      email: data.studentEmail,
      token: token,
      bookingId: bookingId,
      studentName: data.studentName,
    });
  } catch (error) {
    console.error("Error booking consultation:", error);
    throw error;
  }
}

export async function verifyConsultationBooking(token: string) {
  const response = await axios.post("/api/consultations/verify", { token });
  return response.data;
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
        reservationStatus: {
          $ne: "unverified",
        },
      },
      sort: ["startTime:asc"],
      populate: {
        member: {
          fields: ["fullName", "documentId"],
        },
      },
    });

    const response = await fetchData<
      StrapiCollectionResponse<ConsultationBooking>
    >(url.href);

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
