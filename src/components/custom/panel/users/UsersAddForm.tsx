"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { createUsersByEmailSchema } from "@/lib/schemas";
import { getServerStrapiClient } from "@/lib/strapi-server";

type BulkCreateUsersResponse = {
  createdUsers: { email: string }[];
  failedEmails: { email: string; reason: string }[];
};

export default function UsersAddForm() {
  const [isLoading, setIsLoading] = useState(false);

  type EmailsFormValues = z.infer<typeof createUsersByEmailSchema>;

  const form = useForm<EmailsFormValues>({
    resolver: zodResolver(createUsersByEmailSchema),
    defaultValues: {
      emails: "",
    },
  });

  const onSubmit = async (values: EmailsFormValues) => {
    setIsLoading(true);

    const emails = values.emails
      .split(/[\n,;]/)
      .map((e) => e.trim())
      .filter(Boolean);

    try {
      const { data } = await axios.post<BulkCreateUsersResponse>(
        "/api/panel/admin/users",
        { emails },
      );

      const { createdUsers = [], failedEmails = [] }: BulkCreateUsersResponse =
        data;

      if (createdUsers.length) {
        toast.success(`Utworzono ${createdUsers.length} użytkowników`);
      }

      if (failedEmails.length) {
        toast.warning(`Pominięto ${failedEmails.length} adresów`, {
          description: failedEmails
            .map((e) => `${e.email} (${e.reason})`)
            .join(", "),
        });
      }

      form.reset();
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Błąd tworzenia użytkowników";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-2xl font-bold">Tworzenie użytkowników</h1>
          <CardDescription>
            Wprowadź adresy e-mail (oddzielone enterem lub przecinkiem).
            Użytkownicy, którzy już istnieją, zostaną pominięci.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresy e-mail</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder={`jan@example.com\nanna@example.com`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Tworzenie..." : "Utwórz użytkowników"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
