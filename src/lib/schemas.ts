import { object, string } from "zod";

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
