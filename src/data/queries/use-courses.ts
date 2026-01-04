import { getCourses } from "../api/courses";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHook } from "./types";
import type { Course } from "@/types";

export const useCourses = createSuspenseQueryHook<Course[]>(
  queryKeys.courses.all,
  getCourses,
);
