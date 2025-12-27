import { object, string, enum as zEnum } from "zod";

export const memberFormSchema = object({
  fullName: string()
    .min(3, { message: "Imię i nazwisko musi mieć co najmniej 3 znaki." })
    .max(100, { message: "Imię i nazwisko nie może przekraczać 100 znaków." }),
  email: string()
    .email({ message: "Podaj poprawny adres e-mail." })
    .max(100, { message: "Adres e-mail nie może przekraczać 100 znaków." }),
  phone: string()
    .max(20, { message: "Numer telefonu nie może przekraczać 20 znaków." })
    .optional(),
});

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

export const ticketFormSchema = object({
  title: string()
    .min(5, { message: "Tytuł musi mieć co najmniej 5 znaków." })
    .max(200, { message: "Tytuł nie może przekraczać 200 znaków." }),
  description: string()
    .min(10, { message: "Opis musi mieć co najmniej 10 znaków." })
    .max(2000, { message: "Opis nie może przekraczać 2000 znaków." }),
  email: string()
    .email({ message: "Podaj poprawny adres e-mail." })
    .refine(
      (email) => email.endsWith("@agh.edu.pl") || email.endsWith(".agh.edu.pl"),
      {
        message: "Dozwolone są tylko adresy e-mail z domeny AGH (@agh.edu.pl).",
      },
    ),
});

export const ticketStatusSchema = zEnum([
  "pending",
  "open",
  "in-progress",
  "resolved",
  "closed",
]);

export const updateTicketStatusSchema = object({
  ticketStatus: ticketStatusSchema,
});

export const consultationBookingFormSchema = object({
  studentEmail: string()
    .email({ message: "Podaj poprawny adres e-mail." })
    .refine(
      (email) => email.endsWith("@agh.edu.pl") || email.endsWith(".agh.edu.pl"),
      {
        message: "Dozwolone są tylko adresy e-mail z domeny AGH (@agh.edu.pl).",
      },
    ),
  studentName: string().min(3, {
    message: "Imię i nazwisko musi mieć minimum 3 znaki.",
  }),
  fieldAndSubject: string().min(3, {
    message: "Kierunek i przedmiot musi mieć minimum 3 znaki.",
  }),
  startTime: string().min(1, { message: "Wybierz termin konsultacji." }),
  endTime: string().min(1, { message: "Wybierz termin konsultacji." }),
  memberDocumentId: string().min(1, {
    message: "Brak informacji o pracowniku.",
  }),
});
