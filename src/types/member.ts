import type { SimpleLink, SimpleSection } from "./common";

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

export type MemberResearch = {
  id: number;
  PublicationsLink?: SimpleLink;
  ORCIDLink?: SimpleLink;
  ResearchgateLink?: SimpleLink;
  ReasercherIdLink?: SimpleLink;
};

export type MemberSection = (MemberResearch | SimpleSection) & {
  __component: string;
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
