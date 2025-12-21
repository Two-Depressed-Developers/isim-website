"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCSV } from "@/lib/csv-utils";
import { fetchGoogleSheetAsCSV } from "@/lib/google-sheets-utils";

interface DataSourceSelectorProps {
  onDataLoaded: (data: string[][]) => void;
  defaultUrl?: string;
}

const urlSchema = z.object({
  url: z
    .string()
    .url("Podaj prawidłowy URL")
    .refine(
      (url) => url.includes("docs.google.com/spreadsheets"),
      "Podaj prawidłowy URL Google Sheets",
    ),
});

const fileSchema = z.object({
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Wybierz plik CSV",
  }),
});

export function DataSourceSelector({
  onDataLoaded,
  defaultUrl,
}: DataSourceSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: defaultUrl || "",
    },
  });

  const fileForm = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
  });

  const handleUrlSubmit = async (values: z.infer<typeof urlSchema>) => {
    setIsLoading(true);
    try {
      const result = await fetchGoogleSheetAsCSV(values.url);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = parseCSV(result.data);

      if (data.length === 0) {
        throw new Error("Brak danych w arkuszu");
      }

      toast.success(`Załadowano ${data.length} wierszy z URL`);
      onDataLoaded(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nie udało się załadować danych z URL",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSubmit = async (values: z.infer<typeof fileSchema>) => {
    setIsLoading(true);
    try {
      const file = values.file[0];

      if (!file.name.endsWith(".csv")) {
        throw new Error("Wybierz plik CSV");
      }

      const text = await file.text();
      const data = parseCSV(text);

      if (data.length === 0) {
        throw new Error("Brak danych w pliku CSV");
      }

      toast.success(`Załadowano ${data.length} wierszy z pliku`);
      onDataLoaded(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nie udało się załadować pliku CSV",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Wybierz źródło danych</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Google Sheets URL</TabsTrigger>
            <TabsTrigger value="file">Prześlij CSV</TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <Form {...urlForm}>
              <form
                onSubmit={urlForm.handleSubmit(handleUrlSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={urlForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publiczny URL Google Sheets</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Ładowanie..." : "Załaduj z URL"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="file">
            <Form {...fileForm}>
              <form
                onSubmit={fileForm.handleSubmit(handleFileSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={fileForm.control}
                  name="file"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>CSV File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Ładowanie..." : "Załaduj z pliku"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
