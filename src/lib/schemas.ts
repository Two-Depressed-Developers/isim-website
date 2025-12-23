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
