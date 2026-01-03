export type ScrapedDataItem = {
  url: string;
  title: string;
  source: string;
  status: "pending" | "accepted" | "declined";
  authors: string;
  raw_data: Record<string, unknown>;
  description: string;
  institution: string | null;
  confidenceScore: number;
};

export type DataProposal = {
  id: number;
  documentId: string;
  scrapedData: ScrapedDataItem[];
  member?: {
    documentId: string;
  };
};
