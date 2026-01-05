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
import { changeUsernameSchema } from "@/lib/schemas";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useChangeUsername } from "@/data/queries/use-panel";

type ErrorResponse = {
  error: string;
  code?: string;
};

type UsernameFormValues = z.infer<typeof changeUsernameSchema>;

export default function ChangeUsernameForm() {
  const { data: session, update } = useSession();

  const mutation = useChangeUsername();

  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      username: session?.user?.username || "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: UsernameFormValues) => {
    mutation.mutate(
      { username: values.username },
      {
        onSuccess: async (data) => {
          await update({
            ...session,
            user: {
              ...session?.user,
              username: data.username,
            },
          });
          toast.success("Nazwa użytkownika zmieniona pomyślnie");
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
            case "USERNAME_TAKEN":
              form.setError("username", { message: errorMsg });
              break;
            case "VALIDATION_ERROR":
              toast.error(errorMsg);
              break;
            default:
              toast.error(errorMsg);
              console.error("Username change error:", error);
          }
        },
      },
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-5">
        <h2 className="text-lg font-semibold">Zmiana nazwy użytkownika</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Zaktualizuj swoją nazwę wyświetlaną w systemie
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa użytkownika</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Wpisz nową nazwę użytkownika"
                      disabled={mutation.isPending}
                      autoComplete="username"
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
              {mutation.isPending ? "Zapisywanie..." : "Zapisz nazwę"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
