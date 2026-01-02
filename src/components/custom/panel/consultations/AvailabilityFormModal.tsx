"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { consultationAvailabilitySchema } from "@/lib/schemas";
import { z } from "zod";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Poniedziałek" },
  { value: "tuesday", label: "Wtorek" },
  { value: "wednesday", label: "Środa" },
  { value: "thursday", label: "Czwartek" },
  { value: "friday", label: "Piątek" },
] as const;

type FormValues = z.infer<typeof consultationAvailabilitySchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<FormValues> | null;
  onSubmit: (data: FormValues) => void;
};

export function AvailabilityFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(consultationAvailabilitySchema),
    defaultValues: {
      id: initialData?.id,
      documentId: initialData?.documentId,
      dayOfWeek: initialData?.dayOfWeek || "monday",
      startTime: initialData?.startTime?.slice(0, 5) || "",
      endTime: initialData?.endTime?.slice(0, 5) || "",
      durationMinutes: initialData?.durationMinutes || 15,
      isActive: initialData?.isActive ?? true,
      maxAttendees: initialData?.maxAttendees ?? null,
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Czas trwania (minuty)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit osób</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Brak limitu"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
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
