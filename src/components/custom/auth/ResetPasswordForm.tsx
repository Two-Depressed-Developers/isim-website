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
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import axios from "axios";
import { getErrorMessage } from "@/lib/axios";
import { resetPasswordSchema } from "@/lib/schemas";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type Props = {
  className?: string;
  token: string;
};

export default function ResetPasswordForm({ className, token }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      await axios.post("/api/auth/reset-password", {
        token,
        password: values.password,
        passwordConfirmation: values.confirmPassword,
      });

      router.push("/login?state=reset");
    } catch (err) {
      setError(
        getErrorMessage(err, "Wystąpił błąd podczas resetowania hasła."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Ustaw nowe hasło</CardTitle>
          <CardDescription>
            Wprowadź nowe hasło do swojego konta.
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nowe hasło</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nowe hasło"
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
                      <FormLabel>Powtórz hasło</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Powtórz hasło"
                          autoComplete="new-password"
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

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Zapisywanie..." : "Ustaw nowe hasło"}
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
