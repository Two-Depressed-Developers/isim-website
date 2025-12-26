export const queryKeys = {
  members: {
    all: ["members"] as const,
    bySlug: (slug: string) => ["members", slug] as const,
    schema: ["member-schema"] as const,
  },
  tickets: {
    all: ["tickets"] as const,
    byId: (id: string, token: string) => ["tickets", id, token] as const,
    verify: (token: string) => ["tickets", "verify", token] as const,
  },
  consultations: {
    bookings: (memberDocumentId: string) =>
      ["consultation-bookings", memberDocumentId] as const,
    verify: (token: string) => ["consultations", "verify", token] as const,
  },
  calendar: {
    events: ["calendar-events"] as const,
  },
  groups: {
    all: ["groups"] as const,
  },
} as const;
