"use client";

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
import { useChangePassword } from "@/data/queries/use-panel";

type ErrorResponse = {
  error: string;
  code?: string;
};

export default function NewPasswordForm() {
  const mutation = useChangePassword();

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

  const onSubmit = (values: PasswordFormValues) => {
    mutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Hasło zmienione pomyślnie");
          form.reset();
        },
        onError: (error) => {
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
        },
      },
    );
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
                      disabled={mutation.isPending}
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
                      disabled={mutation.isPending}
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
                      disabled={mutation.isPending}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Zmiana..." : "Zmień hasło"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
