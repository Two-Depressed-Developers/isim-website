"use client";

import { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { parseClassroomData } from "@/lib/classroom-utils";
import { useUploadClassroomResources } from "@/data/queries";

interface EditableSheetTableProps {
  initialData: string[][];
}

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

export function EditableSheetTable({ initialData }: EditableSheetTableProps) {
  const { data: session } = useSession();
  const uploadMutation = useUploadClassroomResources();
  const [roomColumnIndex, setRoomColumnIndex] = useState<number | null>(null);
  const [resourceColumnIndex, setResourceColumnIndex] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (initialData.length === 0) {
    return <p>Brak danych do edycji.</p>;
  }

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
      toast.error("Musisz być zalogowany, aby wysłać dane");
      return;
    }

    if (roomColumnIndex === null || resourceColumnIndex === null) {
      toast.error("Wybierz kolumnę z salami i kolumnę z zasobami");
      return;
    }

    setIsSubmitting(true);
    try {
      const roomColumnData: string[] = [];
      const resourceColumnData: string[] = [];

      rows.forEach((_, rowIndex) => {
        const roomField =
          values[
            createFieldName(rowIndex, roomColumnIndex) as keyof FormSchema
          ];
        const resourceField =
          values[
            createFieldName(rowIndex, resourceColumnIndex) as keyof FormSchema
          ];

        if (typeof roomField === "string") roomColumnData.push(roomField);
        if (typeof resourceField === "string")
          resourceColumnData.push(resourceField);
      });

      const classroomData = parseClassroomData(
        roomColumnData,
        resourceColumnData,
      );

      if (classroomData.length === 0) {
        toast.error("Nie znaleziono danych do przetworzenia");
        return;
      }

      toast.info(
        `Przetworzono ${classroomData.length} sal. Trwa wysyłanie do Strapi...`,
      );

      const result = await uploadMutation.mutateAsync({
        data: classroomData,
        accessToken: session.accessToken,
      });

      if (result.success) {
        toast.success(`Pomyślnie zapisano ${result.created} sal`);
      } else {
        toast.error(
          `Zapisano ${result.created} sal, ale wystąpiły błędy: ${result.errors.slice(0, 3).join(", ")}${result.errors.length > 3 ? "..." : ""}`,
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas wysyłania",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setRoomColumnIndex(null);
    setResourceColumnIndex(null);
    toast.info("Zresetowano formularz");
  };

  const visibleColumns = [roomColumnIndex, resourceColumnIndex].filter(
    (idx): idx is number => idx !== null,
  );

  const isValidSelection =
    roomColumnIndex !== null && resourceColumnIndex !== null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg">
              Jak powinny wyglądać dane?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="mb-1 font-semibold">Kolumna z numerami sal:</p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                <li>
                  <code className="rounded bg-white px-1 py-0.5 dark:bg-gray-900">
                    B5 404
                  </code>{" "}
                  - pojedyncza sala
                </li>
                <li>
                  <code className="rounded bg-white px-1 py-0.5 dark:bg-gray-900">
                    B5 404/403
                  </code>{" "}
                  - dwie sale w tym samym budynku
                </li>
                <li>
                  <code className="rounded bg-white px-1 py-0.5 dark:bg-gray-900">
                    B5 404/403/402
                  </code>{" "}
                  - wiele sal
                </li>
                <li>
                  <code className="rounded bg-white px-1 py-0.5 dark:bg-gray-900">
                    B5 404, B5 101
                  </code>{" "}
                  - sale oddzielone przecinkiem
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold">Kolumna z zasobami:</p>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                <li>Zasoby oddzielone przecinkami lub nową linią</li>
                <li>
                  Przykład:{" "}
                  <code className="rounded bg-white px-1 py-0.5 dark:bg-gray-900">
                    AutoCAD 2024, MATLAB R2023, 50 PCs
                  </code>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wybierz kolumny</span>
              <span
                className={cn(
                  `text-sm font-normal`,
                  isValidSelection && "text-green-600 dark:text-green-400",
                  !isValidSelection && "text-red-600 dark:text-red-400",
                )}
              >
                {isValidSelection
                  ? "✓ Wybrano obie kolumny"
                  : "Wybierz obie kolumny"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-3 font-semibold">Kolumna z numerami sal:</p>
              <div className="flex flex-wrap gap-4">
                {headers.map((header, index) => (
                  <div
                    key={`room-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`room-col-${index}`}
                      checked={roomColumnIndex === index}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRoomColumnIndex(index);
                          if (resourceColumnIndex === index) {
                            setResourceColumnIndex(null);
                          }
                        } else {
                          setRoomColumnIndex(null);
                        }
                      }}
                    />
                    <label
                      htmlFor={`room-col-${index}`}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {header || `Kolumna ${index + 1}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-semibold">Kolumna z zasobami:</p>
              <div className="flex flex-wrap gap-4">
                {headers.map((header, index) => (
                  <div
                    key={`resource-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`resource-col-${index}`}
                      checked={resourceColumnIndex === index}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setResourceColumnIndex(index);
                          if (roomColumnIndex === index) {
                            setRoomColumnIndex(null);
                          }
                        } else {
                          setResourceColumnIndex(null);
                        }
                      }}
                    />
                    <label
                      htmlFor={`resource-col-${index}`}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {header || `Kolumna ${index + 1}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upewnij się, że wartości są poprawne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((colIndex) => (
                      <TableHead key={colIndex}>
                        {headers[colIndex] || `Column ${colIndex + 1}`}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {visibleColumns.map((colIndex) => {
                        const fieldName = createFieldName(rowIndex, colIndex);
                        return (
                          <TableCell key={colIndex}>
                            <FormField
                              control={form.control}
                              name={fieldName as Path<FormSchema>}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      className="min-w-[100px]"
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
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Resetuj
          </Button>
          <Button type="submit" disabled={!isValidSelection || isSubmitting}>
            {isSubmitting ? "Wysyłanie..." : "Wyślij do Strapi"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
