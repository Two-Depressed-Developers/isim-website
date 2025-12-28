import qs from "qs";
import axios from "axios";
import { fetchData, baseAPIUrl } from "./base";
import { flattenAttributes } from "@/lib/utils";

export interface ScrapedDataItem {
  url: string;
  title: string;
  source: string;
  status: "pending" | "accepted" | "declined";
  authors: string;
  raw_data: Record<string, any>;
  description: string;
  institution: string | null;
  confidenceScore: number;
}

export interface DataProposal {
  id: number;
  documentId: string;
  scrapedData: ScrapedDataItem[];
  member?: {
    documentId: string;
  };
}

export async function getDataProposals(memberDocumentId: string): Promise<DataProposal[]> {
  const url = new URL("/api/data-proposals", baseAPIUrl);

  url.search = qs.stringify({
    filters: {
      member: {
        documentId: {
          $eq: memberDocumentId,
        },
      },
    },
    populate: {
      member: {
        fields: ["documentId"],
      },
    },
  });

  const response = await fetchData(url.href);
  return response?.data ?? [];
}

export async function updateDataProposal(
  documentId: string,
  data: { scrapedData: ScrapedDataItem[] },
  accessToken: string
): Promise<DataProposal> {
  try {
    const response = await axios.put(
      `${baseAPIUrl}/api/data-proposals/${documentId}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return flattenAttributes(response.data);
  } catch (error) {
    console.error("Error updating data proposal:", error);
    throw error;
  }
}
