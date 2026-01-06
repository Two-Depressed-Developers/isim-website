import qs from "qs";
import type { Conference, StrapiCollectionResponse } from "@/types";
import { baseAPIUrl, fetchData } from "./base";

export async function getConferences(locale: string): Promise<Conference[]> {
  const url = new URL("/api/conferences", baseAPIUrl);

  console.log("Fetching conferences for locale:", locale);

  url.search = qs.stringify({
    populate: {
      conferenceLink: {
        populate: true,
      },
      conferenceImage: {
        populate: true,
      },
    },
    locale,
  });

  const response = await fetchData<StrapiCollectionResponse<Conference>>(
    url.href,
  );

  return response?.data ?? [];
}
