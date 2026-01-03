import qs from "qs";
import axios from "axios";
import { fetchData, baseAPIUrl } from "./base";
import { flattenAttributes } from "@/lib/utils";
import type {
  StrapiCollectionResponse,
  DataProposal,
  ScrapedDataItem,
} from "@/types";

export async function getDataProposals(
  memberDocumentId: string,
): Promise<DataProposal[]> {
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

  const response = await fetchData<StrapiCollectionResponse<DataProposal>>(
    url.href,
  );
  return response?.data ?? [];
}

export async function updateDataProposal(
  documentId: string,
  data: { scrapedData: ScrapedDataItem[] },
  accessToken: string,
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
      },
    );

    return flattenAttributes(response.data);
  } catch (error) {
    console.error("Error updating data proposal:", error);
    throw error;
  }
}
