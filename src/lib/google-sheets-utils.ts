export function normalizeGoogleSheetsUrl(url: string): string {
  if (!url.includes("docs.google.com/spreadsheets")) {
    throw new Error("Invalid Google Sheets URL");
  }

  let normalized = url;

  if (normalized.includes("/pubhtml")) {
    normalized = normalized.replace("/pubhtml", "/pub?output=csv");
  } else if (normalized.includes("/edit")) {
    const baseUrl = normalized.split("/edit")[0];
    normalized = `${baseUrl}/export?format=csv`;
  } else if (
    !normalized.includes("output=csv") &&
    !normalized.includes("export?format=csv")
  ) {
    const separator = normalized.includes("?") ? "&" : "?";
    normalized = `${normalized}${separator}output=csv`;
  }

  return normalized;
}

export async function fetchGoogleSheetAsCSV(
  url: string,
): Promise<
  { success: true; data: string } | { success: false; error: string }
> {
  try {
    const csvUrl = normalizeGoogleSheetsUrl(url);
    const response = await fetch(csvUrl, { cache: "no-store" });

    if (!response.ok) {
      return {
        success: false,
        error: `Nie udało się pobrać danych: ${response.statusText}`,
      };
    }

    const csvText = await response.text();
    return { success: true, data: csvText };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nieznany błąd",
    };
  }
}
