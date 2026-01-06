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
import { setupAccountSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useSetupAccount } from "@/data/queries/use-auth";

type Props = {
  className?: string;
  token: string;
  email: string;
};

export function SetupAccountForm({ className, token, email }: Props) {
  const router = useRouter();
  const mutation = useSetupAccount();

  type SetupAccountFormValues = z.infer<typeof setupAccountSchema>;

  const form = useForm<SetupAccountFormValues>({
    resolver: zodResolver(setupAccountSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: SetupAccountFormValues) => {
    mutation.mutate(
      {
        token,
        username: values.username,
        password: values.password,
      },
      {
        onSuccess: () => router.push("/login?state=setup"),
      },
    );
  };

  const error = mutation.error
    ? getErrorMessage(mutation.error, "Wystąpił błąd podczas aktywacji konta")
    : null;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Aktywacja konta</CardTitle>
          <CardDescription>
            Ustaw nazwę użytkownika i hasło dla konta <strong>{email}</strong>
          </CardDescription>
          {error && (
            <div className="mt-4 rounded-md border-2 border-red-600/10 bg-red-100/25 p-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Nazwa użytkownika</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jan kowalski"
                        autoComplete="username"
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
                  <FormItem className="grid gap-2">
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
                  <FormItem className="grid gap-2">
                    <FormLabel>Potwierdź hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
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
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Aktywuj konto
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
