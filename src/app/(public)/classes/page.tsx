"use client";

import { useState } from "react";
import { DataSourceSelector } from "@/components/custom/classes/DataSourceSelector";
import { EditableSheetTable } from "@/components/custom/classes/EditableSheetTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<string[][] | null>(null);

  const handleDataLoaded = (loadedData: string[][]) => {
    setData(loadedData);
  };

  const handleBack = () => {
    setData(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Classes Data Editor</h1>

      {data === null ? (
        <DataSourceSelector
          onDataLoaded={handleDataLoaded}
          defaultUrl={process.env.NEXT_PUBLIC_SHEET_URL}
        />
      ) : (
        <div className="space-y-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change Data Source
          </Button>
          <EditableSheetTable initialData={data} />
        </div>
      )}
    </div>
  );
}
