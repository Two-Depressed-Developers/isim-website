"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Podaj aktualne hasło"),
    newPassword: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function NewPasswordForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            password: values.newPassword,
            passwordConfirmation: values.confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error?.message || "Nie udało się zmienić hasła";

        if (
          errorMsg.includes("Invalid current password") ||
          errorMsg.includes("password does not match")
        ) {
          form.setError("currentPassword", {
            message: "Obecne hasło jest nieprawidłowe",
          });
          return;
        }

        throw new Error(errorMsg);
      }

      setMessage("Hasło zmienione pomyślnie");
      toast.success("Hasło zostało zmienione");
      form.reset();
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Coś poszło nie tak");
      toast.error("Błąd zmiany hasła");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-w-lg grow">
      <Card className="w-full">
        <CardHeader className="text-center text-xl font-bold">
          Ustaw nowe hasło
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aktualne hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Wpisz aktualne hasło"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nowe hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Wpisz nowe hasło"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potwierdź hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Potwierdź nowe hasło"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {message && (
                <p
                  className={
                    message.includes("pomyślnie")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {message}
                </p>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Zmiana..." : "Zmień hasło"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
