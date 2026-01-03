export type ConsultationBooking = {
  id: number;
  documentId: string;
  studentEmail: string;
  studentName: string;
  fieldAndSubject: string;
  startTime: string;
  endTime: string;
  reservationStatus: "unverified" | "pending" | "accepted" | "declined";
  verificationToken?: string;
  verifiedAtTime?: string;
  member?: {
    id: number;
    documentId: string;
    fullName?: string;
    room?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ConsultationBookingFormData = {
  studentEmail: string;
  studentName: string;
  fieldAndSubject: string;
  startTime: string;
  endTime: string;
  memberDocumentId: string;
};
