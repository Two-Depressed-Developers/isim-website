"use server";

import { parseCSV } from "@/lib/csv-utils";
import { normalizeGoogleSheetsUrl } from "@/lib/google-sheets-utils";

const publicSheetUrl = process.env.PUBLIC_SHEET_HTML_URL;

export async function getHtmlTableData() {
  if (!publicSheetUrl) {
    console.error(
      "PUBLIC_SHEET_HTML_URL not configured in environment variables.",
    );
    return [];
  }

  try {
    const csvUrl = normalizeGoogleSheetsUrl(publicSheetUrl);

    const response = await fetch(csvUrl, { cache: "no-store" });
    if (!response.ok) {
      console.error(
        `Failed to fetch CSV: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const csvText = await response.text();
    const data = parseCSV(csvText);

    return data;
  } catch (error) {
    console.error("Error parsing public sheet CSV:", error);
    return [];
  }
}
