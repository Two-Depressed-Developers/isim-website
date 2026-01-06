"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUploadClassroomResources } from "@/data/queries/use-classrooms";
import { useSession } from "next-auth/react";
import { ClassroomResource } from "@/types";

type Props = {
  initialData: string[][];
};

type FieldName = `row_${number}_col_${number}`;

const createFieldName = (rowIndex: number, colIndex: number): FieldName =>
  `row_${rowIndex}_col_${colIndex}`;

const createFormSchema = (rowCount: number, colCount: number) => {
  const rowSchemas: Record<string, z.ZodString> = {};

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      rowSchemas[createFieldName(row, col)] = z.string();
    }
  }

  return z.object({
    ...rowSchemas,
  });
};

type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

export function EditableSheetTable({ initialData }: Props) {
  const [roomColIndex, setRoomColIndex] = useState<string>("");
  const [resourceColIndex, setResourceColIndex] = useState<string>("");

  const { data: session } = useSession();
  const uploadMutation = useUploadClassroomResources();

  const headers = initialData[0];
  const rows = initialData.slice(1);

  const defaultValues: Record<string, string> = {};

  rows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      defaultValues[createFieldName(rowIndex, colIndex)] = cell || "";
    });
  });

  const formSchema = createFormSchema(rows.length, headers.length);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormSchema) => {
    if (!session?.accessToken) {
      toast.error("Musisz być zalogowany, aby przesyłać dane.");
      return;
    }

    if (!roomColIndex || !resourceColIndex) {
      toast.error("Musisz wybrać obie kolumny przed wysłaniem.");
      return;
    }

    if (roomColIndex === resourceColIndex) {
      toast.error("Wybierz dwie różne kolumny.");
      return;
    }

    const rIdx = parseInt(roomColIndex);
    const resIdx = parseInt(resourceColIndex);

    // Map to aggregate data: Key = "Building RoomNumber"
    const aggregatedData = new Map<string, ClassroomResource>();

    rows.forEach((row, rowIndex) => {
      // Helper to safely get value from row at specific index
      const getVal = (idx: number) => {
        const fieldName = createFieldName(rowIndex, idx);
        // Prioritize value from form state (user edits)
        const val = values[fieldName as keyof FormSchema];
        return typeof val === "string" ? val : "";
      };

      const rawRoomValue = getVal(rIdx);
      const rawResourceValue = getVal(resIdx);

      if (!rawRoomValue) return;

      const resources = rawResourceValue
        ? rawResourceValue
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [];

      // Split rooms by comma (e.g. "B4 011, B5 201A")
      const rooms = rawRoomValue
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      rooms.forEach((roomStr) => {
        // Extract building and room number
        let building = "";
        let roomNumber = roomStr;

        // Regex: Starts with Letter(s)+Digit(s) then space then rest
        const match = roomStr.match(/^([a-zA-Z]+\d+)\s+(.*)$/);
        if (match) {
          building = match[1];
          roomNumber = match[2];
        }

        const uniqueKey = building ? `${building} ${roomNumber}` : roomNumber;

        if (!aggregatedData.has(uniqueKey)) {
          aggregatedData.set(uniqueKey, {
            building,
            roomNumber,
            fullRoomCode: uniqueKey,
            resources: [],
          });
        }

        const entry = aggregatedData.get(uniqueKey)!;
        // Add resources, avoiding duplicates
        const currentSet = new Set(entry.resources);
        resources.forEach((r) => currentSet.add(r));
        entry.resources = Array.from(currentSet);
      });
    });

    const dataToUpload = Array.from(aggregatedData.values());

    try {
      await uploadMutation.mutateAsync({
        data: dataToUpload,
        accessToken: session.accessToken as string,
      });
      toast.success(`Pomyślnie załadowano ${dataToUpload.length} sal.`);
    } catch (error) {
      toast.error("Wystąpił błąd podczas przesyłania danych.");
      console.error(error);
    }
  };

  const handleReset = () => {
    form.reset();
    setRoomColIndex("");
    setResourceColIndex("");
    toast.info("Zresetowano formularz");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mapowanie Kolumn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                  Kolumna z Salami (np. &quot;25 612&quot;)
                </FormLabel>
                <Select value={roomColIndex} onValueChange={setRoomColIndex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kolumnę" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {h || `Kolumna ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  Kolumna z Oprogramowaniem
                </FormLabel>
                <Select
                  value={resourceColIndex}
                  onValueChange={setResourceColIndex}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kolumnę" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((h, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {h || `Kolumna ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Podgląd i Edycja Danych</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className={cn(
                          "transition-colors",
                          index.toString() === roomColIndex &&
                            "bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                          index.toString() === resourceColIndex &&
                            "bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                          index.toString() !== roomColIndex &&
                            index.toString() !== resourceColIndex &&
                            "text-muted-foreground",
                        )}
                      >
                        {header || `Column ${index + 1}`}
                        {index.toString() === roomColIndex && (
                          <span className="ml-2 text-xs">(Sale)</span>
                        )}
                        {index.toString() === resourceColIndex && (
                          <span className="ml-2 text-xs">(Zasoby)</span>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((_, colIndex) => {
                        const fieldName = createFieldName(rowIndex, colIndex);
                        const isSelected =
                          colIndex.toString() === roomColIndex ||
                          colIndex.toString() === resourceColIndex;

                        return (
                          <TableCell
                            key={colIndex}
                            className={cn(!isSelected && "opacity-50")}
                          >
                            <FormField
                              control={form.control}
                              name={fieldName}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      className="min-w-[100px]"
                                      disabled={!isSelected}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleReset}>
            Resetuj
          </Button>
          <Button type="submit" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? "Przesyłanie..." : "Wyślij"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
