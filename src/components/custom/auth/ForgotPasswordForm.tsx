"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { getErrorMessage } from "@/lib/axios";
import { forgotPasswordSchema } from "@/lib/schemas";
import { useForgotPassword } from "@/data/queries/use-auth";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type Props = {
  className?: string;
};

export default function ForgotPasswordForm({ className }: Props) {
  const mutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    mutation.mutate({ email: values.email });
  };

  const error = mutation.isError
    ? getErrorMessage(mutation.error, "Wystąpił błąd podczas wysyłania emaila.")
    : null;

  if (mutation.isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Email wysłany</CardTitle>
            <CardDescription>
              Jeśli konto z podanym adresem email istnieje, otrzymasz wiadomość
              z instrukcjami dotyczącymi resetowania hasła.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Powrót do logowania</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Resetowanie hasła</CardTitle>
          <CardDescription>
            Podaj adres email powiązany z Twoim kontem, a wyślemy Ci link do
            resetowania hasła.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="rounded-md border-2 border-red-600/10 bg-red-100/25 p-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Wysyłanie..."
                    : "Wyślij link resetujący"}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-primary text-sm hover:underline"
              >
                Powrót do logowania
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
