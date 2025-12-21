"use client";

import { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

  return z
    .object({
      ...rowSchemas,
      excludedColumns: z.array(z.number()),
    })
    .refine(
      (data) => {
        const selectedCount = colCount - data.excludedColumns.length;
        return selectedCount === 2;
      },
      {
        message: "Musisz wybrać dokładnie 2 kolumny",
        path: ["excludedColumns"],
      },
    );
};

type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

export function EditableSheetTable({ initialData }: EditableSheetTableProps) {
  const [excludedColumns, setExcludedColumns] = useState<Set<number>>(
    new Set(),
  );

  if (initialData.length === 0) {
    return <p>Brak danych do edycji.</p>;
  }

  const headers = initialData[0];
  const rows = initialData.slice(1);

  const defaultValues: Record<string, string | number[]> = {
    excludedColumns: [],
  };

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

  const toggleColumn = (colIndex: number) => {
    const newExcluded = new Set(excludedColumns);
    if (newExcluded.has(colIndex)) {
      newExcluded.delete(colIndex);
    } else {
      newExcluded.add(colIndex);
    }
    setExcludedColumns(newExcluded);
    form.setValue("excludedColumns", Array.from(newExcluded));
    form.trigger("excludedColumns");
  };

  const onSubmit = (values: FormSchema) => {
    const selectedHeaders = headers.filter(
      (_, index) => !excludedColumns.has(index),
    );
    const submittedData: string[][] = [selectedHeaders];

    rows.forEach((_, rowIndex) => {
      const rowData: string[] = [];
      headers.forEach((_, colIndex) => {
        if (!excludedColumns.has(colIndex)) {
          const fieldName = createFieldName(rowIndex, colIndex);
          const fieldValue = values[fieldName as keyof FormSchema];
          if (typeof fieldValue === "string") {
            rowData.push(fieldValue);
          }
        }
      });
      submittedData.push(rowData);
    });

    toast.success(
      `Wysłano ${submittedData.length - 1} wierszy z kolumnami: ${selectedHeaders.join(", ")}`,
    );
  };

  const handleReset = () => {
    form.reset();
    setExcludedColumns(new Set());
    form.setValue("excludedColumns", []);
    toast.info("Zresetowano formularz");
  };

  const visibleColumns = headers
    .map((_, index) => index)
    .filter((index) => !excludedColumns.has(index));

  const selectedColumnsCount = headers.length - excludedColumns.size;
  const isValidSelection = selectedColumnsCount === 2;
  const formErrors = form.formState.errors;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wybierz kolumny które zawierają oprogramowanie i sale</span>
              <span
                className={cn(
                  `text-sm font-normal`,
                  isValidSelection && "text-green-600 dark:text-green-400",
                  !isValidSelection && "text-red-600 dark:text-red-400",
                )}
              >
                {selectedColumnsCount} / 2 kolumny wybrane
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${index}`}
                    checked={!excludedColumns.has(index)}
                    onCheckedChange={() => toggleColumn(index)}
                  />
                  <label
                    htmlFor={`col-${index}`}
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {header || `Column ${index + 1}`}
                  </label>
                </div>
              ))}
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
                              name={
                                fieldName as Exclude<
                                  Path<FormSchema>,
                                  "excludedColumns"
                                >
                              }
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
          <Button type="button" variant="outline" onClick={handleReset}>
            Resetuj
          </Button>
          <Button type="submit" disabled={!isValidSelection}>
            Wyślij
          </Button>
        </div>
      </form>
    </Form>
  );
}
