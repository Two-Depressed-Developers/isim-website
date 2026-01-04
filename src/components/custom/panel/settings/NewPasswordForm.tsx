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
import { changePasswordSchema } from "@/lib/schemas";
import axios from "axios";

type ErrorResponse = {
  error: string;
  code?: string;
};

export default function NewPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  type PasswordFormValues = z.infer<typeof changePasswordSchema>;

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsLoading(true);

    try {
      await axios.post("/api/panel/settings/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      toast.success("Hasło zmienione pomyślnie");
      form.reset();
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        toast.error("Coś poszło nie tak");
        return;
      }

      const data = error.response?.data as ErrorResponse | undefined;
      const errorCode = data?.code;
      const errorMsg = data?.error || "Coś poszło nie tak";

      switch (errorCode) {
        case "INVALID_CURRENT_PASSWORD":
          form.setError("currentPassword", { message: errorMsg });
          break;
        case "VALIDATION_ERROR":
          toast.error(errorMsg);
          break;
        default:
          toast.error(errorMsg);
          console.error("Password change error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader className="border-b pb-5">
        <h2 className="text-lg font-semibold">Zmiana hasła</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Zaktualizuj swoje hasło, aby zabezpieczyć swoje konto
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      disabled={isLoading}
                      autoComplete="current-password"
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
                      disabled={isLoading}
                      autoComplete="new-password"
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
                      disabled={isLoading}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Zmiana..." : "Zmień hasło"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
