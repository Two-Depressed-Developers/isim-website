import {
  bookConsultation,
  getMemberConsultationBookings,
  updateConsultationBookingStatus,
  verifyConsultationBooking,
} from "../api/consultations";
import { queryKeys } from "../query-keys";
import {
  createSuspenseQueryHookWithParams,
  createMutationHookWithInvalidation,
} from "./types";

export function useBookConsultation(slug: string) {
  return createMutationHookWithInvalidation(
    bookConsultation,
    queryKeys.members.bySlug(slug),
  )();
}

export const useVerifyConsultationBooking = createSuspenseQueryHookWithParams(
  (token: string | null) => queryKeys.consultations.verify(token!),
  (token: string | null) => verifyConsultationBooking(token!),
  () => ({ retry: false }),
);

export const useConsultationBookings = createSuspenseQueryHookWithParams(
  (memberDocumentId: string) =>
    queryKeys.consultations.bookings(memberDocumentId),
  getMemberConsultationBookings,
);

export function useUpdateConsultationBookingStatus(memberDocumentId: string) {
  return createMutationHookWithInvalidation<
    unknown,
    {
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
    }
  >(
    ({ documentId, status, accessToken, emailData }) =>
      updateConsultationBookingStatus(
        documentId,
        status,
        accessToken,
        emailData,
      ),
    queryKeys.consultations.bookings(memberDocumentId),
  )();
}
