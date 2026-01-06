export const queryKeys = {
  members: {
    all: ["members"] as const,
    bySlug: (slug: string) => ["members", slug] as const,
    schema: ["member-schema"] as const,
  },
  tickets: {
    all: (accessToken: string) => ["tickets", accessToken] as const,
    byId: (id: string, token: string) => ["tickets", id, token] as const,
    verify: (token: string) => ["tickets", "verify", token] as const,
  },
  consultations: {
    bookings: (memberDocumentId: string) =>
      ["consultation-bookings", memberDocumentId] as const,
    verify: (token: string) => ["consultations", "verify", token] as const,
  },
  calendar: {
    events: (locale: string) => ["calendar-events", locale] as const,
  },
  groups: {
    all: (locale: string) => ["groups", locale] as const,
  },
  dataProposals: {
    byMember: (memberDocumentId: string) =>
      ["data-proposals", memberDocumentId] as const,
  },
  researchOffers: {
    all: (locale: string) => ["research-offers", locale] as const,
  },
  courses: {
    all: (locale: string) => ["courses", locale] as const,
  },
  conferences: {
    all: (locale: string) => ["conferences", locale] as const,
  },
  journals: {
    all: (locale: string) => ["journals", locale] as const,
  },
  homepage: {
    data: ["homepage"] as const,
    schema: ["homepage-schema"] as const,
  },
  classrooms: {
    all: ["classrooms"] as const,
  },
};
