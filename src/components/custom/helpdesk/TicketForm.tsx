"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useSubmitTicket } from "@/data/queries/use-tickets";
import { getTicketFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type Props = {
  defaultEmail?: string;
};

export function TicketForm({ defaultEmail }: Props) {
  const t = useTranslations("TicketForm");
  const tValidation = useTranslations();
  const submitTicketMutation = useSubmitTicket();

  const ticketSchema = getTicketFormSchema(tValidation);

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      email: defaultEmail || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    submitTicketMutation.mutate(values, {
      onSuccess: (result) => {
        toast.success(result.success ? t("success") : t("error"));
        form.reset();
      },
      onError: () => {
        toast.error(t("error"));
      },
    });
  }

  return (
    <Card className="w-full max-w-2xl pt-6">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder")}
                      {...field}
                      disabled={submitTicketMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    {t("titleLabel")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      {...field}
                      disabled={submitTicketMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>{t("emailDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="min-h-32 resize-none"
                      {...field}
                      disabled={submitTicketMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>{t("descriptionHelp")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitTicketMutation.isPending}
              className="w-full"
            >
              {submitTicketMutation.isPending ? t("submitting") : t("submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
