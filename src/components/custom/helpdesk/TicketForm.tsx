"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";

import { ticketFormSchema } from "@/lib/schemas";
import { useSubmitTicket } from "@/data/queries/use-tickets";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TicketFormProps = {
  defaultEmail?: string;
};

export function TicketForm({ defaultEmail }: TicketFormProps) {
  const submitTicketMutation = useSubmitTicket();

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      email: defaultEmail || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ticketFormSchema>) {
    submitTicketMutation.mutate(values, {
      onSuccess: (result: any) => {
        if (result.message) {
          toast.success(result.message);
        } else {
          toast.success("Zgłoszenie zostało utworzone pomyślnie!");
        }
        form.reset();
      },
      onError: (error) => {
        console.error("Błąd podczas tworzenia zgłoszenia:", error);
        toast.error("Wystąpił błąd podczas tworzenia zgłoszenia");
      },
    });
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Nowe zgłoszenie</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Krótki opis problemu"
                      {...field}
                      disabled={submitTicketMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres e-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="twoj.email@example.com"
                      {...field}
                      disabled={submitTicketMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Wymagany adres e-mail z domeny AGH. Wyślemy link
                    weryfikacyjny.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Szczegółowy opis problemu..."
                      className="min-h-32 resize-none"
                      {...field}
                      disabled={submitTicketMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Opisz problem możliwie szczegółowo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitTicketMutation.isPending}
              className="w-full"
            >
              {submitTicketMutation.isPending
                ? "Wysyłanie..."
                : "Wyślij zgłoszenie"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
