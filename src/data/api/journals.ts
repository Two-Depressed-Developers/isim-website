import qs from "qs";
import type { Journal } from "@/types/strapi";
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

  const response = await fetchData(url.href);

  return response?.data ?? [];
}
