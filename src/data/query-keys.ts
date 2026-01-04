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
    all: ["groups"] as const,
  },
  dataProposals: {
    byMember: (memberDocumentId: string) =>
      ["data-proposals", memberDocumentId] as const,
  },
  researchOffers: {
    all: ["research-offers"] as const,
  },
  courses: {
    all: ["courses"] as const,
  },
  conferences: {
    all: ["conferences"] as const,
  },
  journals: {
    all: ["journals"] as const,
  },
  homepage: {
    data: ["homepage"] as const,
    schema: ["homepage-schema"] as const,
  },
};
