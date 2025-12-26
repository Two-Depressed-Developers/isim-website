import {
  bookConsultation,
  getMemberConsultationBookings,
  updateConsultationBookingStatus,
} from "../api/consultations";
import { queryKeys } from "../query-keys";
import {
  createQueryHookWithParams,
  createMutationHookWithInvalidation,
} from "./types";

export function useBookConsultation(slug: string) {
  return createMutationHookWithInvalidation(
    bookConsultation,
    queryKeys.members.bySlug(slug),
  )();
}

export const useConsultationBookings = createQueryHookWithParams(
  (memberDocumentId: string) =>
    queryKeys.consultations.bookings(memberDocumentId),
  getMemberConsultationBookings,
  (memberDocumentId: string) => ({ enabled: !!memberDocumentId }),
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
