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
import { Github } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { loginFormSchema } from "@/lib/schemas";

export function ErrorMessage({ code }: { code: string | null }) {
  let message = "";

  if (!code) return null;

  switch (code) {
    case "AccountExistsNoLink":
      message =
        "Masz już konto z tym adresem email. Zaloguj się hasłem, a następnie połącz konto GitHub w ustawieniach.";
      break;
    case "UserNotFound":
      message = "Nie znaleziono konta. Poproś administratora o zaproszenie.";
      break;
    case "CredentialsSignin":
      message = "Błąd logowania. Sprawdź swoje dane i spróbuj ponownie.";
      break;
    default:
      message = "Wystąpił błąd logowania.";
  }

  return (
    <div className="mt-4 rounded-md border-2 border-red-600/10 bg-red-100/25 p-2 text-sm text-red-600">
      {message}
    </div>
  );
}

type Props = {
  className?: string;
  errorCode?: string | null;
};

export function LoginForm({ errorCode, className }: Props) {
  const [submitting, setSubmitting] = useState(false);

  type LoginFormValues = z.infer<typeof loginFormSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setSubmitting(true);
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        redirectTo: "/panel/profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Panel logowania</CardTitle>
          <CardDescription>
            Zaloguj się za pomocą konta uczelniowego, aby edytować swój profil
          </CardDescription>
          {errorCode && <ErrorMessage code={errorCode} />}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
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

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hasło</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Logowanie…" : "Login"}
                  </Button>
                </form>
              </Form>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  signIn("github", {
                    redirect: true,
                    redirectTo: "/panel/profile",
                  })
                }
              >
                <Github />
                Login with Github
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Image
                  src="/images/agh_logo.png"
                  alt="AGH Logo"
                  width={12}
                  height={12}
                  className="h-auto w-3"
                />
                Login with AGH Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
