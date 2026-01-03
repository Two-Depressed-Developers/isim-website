import qs from "qs";
import type { Conference } from "@/types/strapi";
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

  const response = await fetchData(url.href);

  return response?.data ?? [];
}
