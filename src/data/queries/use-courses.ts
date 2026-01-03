import { getCourses } from "../api/courses";
import { queryKeys } from "../query-keys";
import { createQueryHook } from "./types";
import type { Course } from "@/types/strapi";

export const useCourses = createQueryHook<Course[]>(
  queryKeys.courses.all,
  getCourses,
);
