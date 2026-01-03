import qs from "qs";
import type { Course, StrapiCollectionResponse } from "@/types";
import { baseAPIUrl, fetchData } from "./base";

export async function getCourses(): Promise<Course[]> {
  const url = new URL("/api/courses", baseAPIUrl);

  url.search = qs.stringify({
    populate: {
      syllabusLink: {
        populate: true,
      },
    },
  });

  const response = await fetchData<StrapiCollectionResponse<Course>>(url.href);

  return response?.data ?? [];
}
