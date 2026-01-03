import qs from "qs";
import type { Conference, StrapiCollectionResponse } from "@/types";
import { baseAPIUrl, fetchData } from "./base";

export async function getConferences(): Promise<Conference[]> {
  const url = new URL("/api/conferences", baseAPIUrl);

  url.search = qs.stringify({
    populate: {
      conferenceLink: {
        populate: true,
      },
      conferenceImage: {
        populate: true,
      },
    },
  });

  const response = await fetchData<StrapiCollectionResponse<Conference>>(
    url.href,
  );

  return response?.data ?? [];
}
