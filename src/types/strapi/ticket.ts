export type TicketStatus =
  | "pending"
  | "open"
  | "in-progress"
  | "resolved"
  | "closed";

export type Ticket = {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  email: string;
  ticketStatus?: TicketStatus;
  verificationToken?: string;
  verifiedAtTime?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TicketFormData = {
  title: string;
  description: string;
  email: string;
};
