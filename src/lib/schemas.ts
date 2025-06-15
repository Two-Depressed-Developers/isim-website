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
