import qs from "qs";
import type { Course } from "@/lib/types";
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

  const response = await fetchData(url.href);

  return response?.data ?? [];
}
