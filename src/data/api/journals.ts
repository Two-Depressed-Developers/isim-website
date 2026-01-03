import qs from "qs";
import type { Journal, StrapiCollectionResponse } from "@/types";
import { baseAPIUrl, fetchData } from "./base";

export async function getJournals(): Promise<Journal[]> {
  const url = new URL("/api/journals", baseAPIUrl);

  url.search = qs.stringify({
    populate: {
      journalLink: {
        populate: true,
      },
      coverImage: {
        populate: true,
      },
    },
  });

  const response = await fetchData<StrapiCollectionResponse<Journal>>(url.href);

  return response?.data ?? [];
}
