"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConsultationAvailability } from "@/types/strapi";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Poniedziałek" },
  { value: "tuesday", label: "Wtorek" },
  { value: "wednesday", label: "Środa" },
  { value: "thursday", label: "Czwartek" },
  { value: "friday", label: "Piątek" },
] as const;

const itemSchema = z
  .object({
    id: z.number().optional(),
    documentId: z.string().optional(),
    dayOfWeek: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
    startTime: z
      .string()
      .nonempty("Pole wymagane")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:mm"),
    endTime: z
      .string()
      .nonempty("Pole wymagane")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "HH:mm"),
    durationMinutes: z.coerce.number().min(1, "Musi być > 0"),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      const [startHour, startMin] = data.startTime.split(":").map(Number);
      const [endHour, endMin] = data.endTime.split(":").map(Number);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;
      return endTotal > startTotal;
    },
    {
      message: "Godzina zakończenia musi być po godzinie rozpoczęcia",
      path: ["endTime"],
    },
  );

type FormValues = z.infer<typeof itemSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ConsultationAvailability> | null;
  onSubmit: (data: FormValues) => void;
};

export function AvailabilityFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(itemSchema),
    values: {
      id: initialData?.id,
      documentId: initialData?.documentId,
      dayOfWeek: initialData?.dayOfWeek || "monday",
      startTime: initialData?.startTime?.slice(0, 5) || "",
      endTime: initialData?.endTime?.slice(0, 5) || "",
      durationMinutes: initialData?.durationMinutes || 15,
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edytuj termin" : "Dodaj nowy termin"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dzień tygodnia</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz dzień" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Początek</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koniec</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Czas trwania okna (minuty)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                  <FormLabel className="cursor-pointer text-base">
                    Aktywny
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">
                {initialData ? "Zapisz zmiany" : "Dodaj"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
