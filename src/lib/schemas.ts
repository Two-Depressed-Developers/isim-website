import {
  boolean,
  coerce,
  infer as zInfer,
  number,
  object,
  string,
  enum as zEnum,
  ZodIssueCode,
} from "zod";

export type TFunction = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export const loginFormSchema = object({
  email: string()
    .min(1, { message: "Email jest wymagany." })
    .email({ message: "Podaj poprawny adres e-mail." })
    .max(100, { message: "Adres e-mail nie może przekraczać 100 znaków." }),
  password: string()
    .min(1, { message: "Hasło jest wymagane." })
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków." })
    .max(128, { message: "Hasło nie może przekraczać 128 znaków." }),
});

export const createUsersByEmailSchema = object({
  emails: string()
    .min(1, "Podaj przynajmniej jeden adres e-mail")
    .refine(
      (value) => {
        const list = value
          .split(/[\n,;]/)
          .map((e) => e.trim())
          .filter(Boolean);

        return list.every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      },
      {
        message:
          "Lista zawiera nieprawidłowy adres e-mail (oddzielaj enterem lub przecinkiem)",
      },
    ),
});

export const changePasswordSchema = object({
  currentPassword: string().min(1, "Podaj aktualne hasło"),
  newPassword: string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  confirmPassword: string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

export const changeUsernameSchema = object({
  username: string()
    .min(3, { message: "Nazwa użytkownika musi mieć co najmniej 3 znaki." })
    .max(50, { message: "Nazwa użytkownika nie może przekraczać 50 znaków." })
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9._\s-]+$/, {
      message:
        "Nazwa użytkownika może zawierać tylko litery, cyfry, spacje, kropki, myślniki i podkreślenia.",
    }),
});

export const forgotPasswordSchema = object({
  email: string()
    .min(1, { message: "Email jest wymagany." })
    .email({ message: "Podaj poprawny adres e-mail." })
    .max(100, { message: "Adres e-mail nie może przekraczać 100 znaków." }),
});

export const resetPasswordSchema = object({
  password: string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków." })
    .max(128, { message: "Hasło nie może przekraczać 128 znaków." }),
  confirmPassword: string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

export const setupAccountSchema = object({
  username: string()
    .min(3, { message: "Nazwa użytkownika musi mieć co najmniej 3 znaki." })
    .max(50, { message: "Nazwa użytkownika nie może przekraczać 50 znaków." })
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9._\s-]+$/, {
      message:
        "Nazwa użytkownika może zawierać tylko litery, cyfry, spacje, kropki, myślniki i podkreślenia.",
    }),
  password: string()
    .min(6, { message: "Hasło musi mieć co najmniej 6 znaków." })
    .max(128, { message: "Hasło nie może przekraczać 128 znaków." }),
  confirmPassword: string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"],
});

export const getTicketFormSchema = (t: TFunction) =>
  object({
    title: string()
      .min(5, { message: t("Validation.minCharacters", { min: 5 }) })
      .max(200, { message: t("Validation.maxCharacters", { max: 200 }) }),
    description: string()
      .min(10, { message: t("Validation.minCharacters", { min: 10 }) })
      .max(2000, { message: t("Validation.maxCharacters", { max: 2000 }) }),
    email: string()
      .email({ message: t("Validation.invalidEmail") })
      .refine(
        (email) =>
          email.endsWith("@agh.edu.pl") || email.endsWith(".agh.edu.pl"),
        {
          message: t("Validation.aghEmail"),
        },
      ),
  });

export const getConsultationBookingFormSchema = (t: TFunction) =>
  object({
    studentEmail: string()
      .email({ message: t("Validation.invalidEmail") })
      .refine(
        (email) =>
          email.endsWith("@agh.edu.pl") || email.endsWith(".agh.edu.pl"),
        {
          message: t("Validation.aghEmail"),
        },
      ),
    studentName: string().min(3, {
      message: t("Validation.minCharacters", { min: 3 }),
    }),
    fieldAndSubject: string().min(3, {
      message: t("Validation.minCharacters", { min: 3 }),
    }),
    startTime: string().min(1, { message: t("Validation.selectionRequired") }),
    endTime: string().min(1, { message: t("Validation.selectionRequired") }),
    memberDocumentId: string().min(1, {
      message: t("Validation.memberInfoMissing"),
    }),
  });

export const consultationAvailabilitySchema = object({
  id: number().optional(),
  documentId: string().optional(),
  dayOfWeek: zEnum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  startTime: string()
    .min(1, "Pole wymagane")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:mm"),
  endTime: string()
    .min(1, "Pole wymagane")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:mm"),
  durationMinutes: coerce.number().min(1, "Musi być > 0"),
  isActive: boolean(),
  maxAttendees: coerce.number().min(1, "Musi być > 0").nullable().optional(),
}).superRefine((data, ctx) => {
  if (!data.startTime || !data.endTime) return;
  if (!data.startTime.match(/:/) || !data.endTime.match(/:/)) return;

  const [startHour, startMin] = data.startTime.split(":").map(Number);
  const [endHour, endMin] = data.endTime.split(":").map(Number);

  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;

  if (endTotal <= startTotal) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "Godzina zakończenia musi być późniejsza",
      path: ["endTime"],
    });
  }
});

export type ConsultationAvailabilityFormData = zInfer<
  typeof consultationAvailabilitySchema
>;
