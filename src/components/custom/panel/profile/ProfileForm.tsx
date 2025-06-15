"use client";

import { useForm } from "react-hook-form";
import { MemberData } from "@/lib/types";
import { memberFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";

type ProfileFormProps = {
  member: MemberData;
  session?: Session;
};

export default function ProfileForm({ member, session }: ProfileFormProps) {
  const form = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      fullName: member.fullName ?? "",
      email: member.email ?? "",
      phone: member.phone ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof memberFormSchema>) => {
    console.log("Form submitted with data:", data);

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/members/${member.documentId}`,
      {
        data: {
          ...data,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 200) {
      console.log("Profile updated successfully:", res.data.data.phone);
      alert("Profil został zaktualizowany pomyślnie!");
      form.reset(res.data.data);
    } else {
      alert("Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.");
      console.error("Error updating profile:", res.data);
    }

    console.log("Response from server:", res.data);
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader className="text-center text-2xl font-bold">
        Edytuj swój profil
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię i nazwisko</FormLabel>
                  <FormControl>
                    <Input placeholder="Jan Kowalski" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@com.pl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="+48 123 456 789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Zapisz zmiany
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
