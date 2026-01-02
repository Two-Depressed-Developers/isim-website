type Pagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
};

export type SimpleLink = {
  id: number;
  URL: string;
  label: string;
  isExternal: boolean;
  openInNewWindow: boolean;
};

export type Link = {
  id: number;
  URL: string;
  label: string;
  isExternal: boolean;
  openInNewWindow: boolean;
  subLinks?: Link[];
  page?: Page;
};

export type ImageLink = {
  id: number;
  alt: string;
  image: {
    url: string;
  };
  link: Link;
};

export type SimpleSection = {
  id: number;
  title: string;
  text: string;
  images: ImageLink[];
  cta?: Link;
};

export type Page = {
  name: string;
  slug: string;
};

export type MemberResearch = {
  id: number;
  PublicationsLink?: Link;
  ORCIDLink?: Link;
  ResearchgateLink?: Link;
  ReasercherIdLink?: Link;
};

export type MemberSection = (MemberResearch | SimpleSection) & {
  __component: string;
};

export type ConsultationAvailability = {
  id: number;
  documentId: string;
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isActive: boolean;
  maxAttendees?: number | null;
};

export type Member = {
  id: number;
  documentId: string;
  fullName: string;
  slug: string;
  title: string;
  phone?: string;
  email?: string;
  position?: string;
  room?: string;
  photo?: {
    url: string;
    alternativeText: string;
  };
  USOSLink?: SimpleLink;
  BADAPLink?: SimpleLink;
  SKOSLink?: SimpleLink;
  PortfolioLink?: SimpleLink;
  sections?: MemberSection[];
  consultationAvailability?: ConsultationAvailability[];
};

export type MemberData = Member & {
  error: boolean;
};

export type Group = {
  id: number;
  documentId: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  siteLink?: SimpleLink;
  badapLink?: SimpleLink;
  keywords?: string;
  supervisor?: MemberData;
  members?: MemberData[];
};

export type GroupData = { data: Group[]; meta: Pagination } & {
  error: boolean;
};

export type Footer = {
  copyrightText: string;
  universityLogo: ImageLink;
  sections: SimpleSection[];
};

export type FooterData = Footer & {
  error: boolean;
};

export type Header = {
  logo: ImageLink;
  links: Link[];
};

export type HeaderData = Header & {
  error: boolean;
};

export type CalendarEvent = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

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

export type SectionFeatureItem = {
  id: number;
  value?: string;
};

export type OfferSection = {
  id: number;
  sectionTitle: string;
  features?: SectionFeatureItem[];
};

export type ResearchOffer = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  offerSections?: OfferSection[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type Course = {
  id: number;
  documentId: string;
  title: string;
  degreeType: "I stopień" | "II stopień";
  format: "Stacjonarne" | "Niestacjonarne";
  semesterCount: number;
  description?: string;
  syllabusLink?: SimpleLink;
};

export type Conference = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventType: "Cykliczne" | "Jednorazowe";
  conferenceLink?: SimpleLink;
  conferenceImage?: {
    url: string;
    alternativeText: string;
  };
};

export type Journal = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  journalLink?: SimpleLink;
  coverImage?: {
    url: string;
    alternativeText: string;
  };
};

// TODO: Add error for xxxData types
