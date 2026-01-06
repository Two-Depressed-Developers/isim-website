import { getCourses } from "../api/courses";
import { queryKeys } from "../query-keys";
import { createSuspenseQueryHookWithParams } from "./types";
import type { Course } from "@/types";

export const useCourses = createSuspenseQueryHookWithParams<Course[], [string]>(
  queryKeys.courses.all,
  getCourses,
);
