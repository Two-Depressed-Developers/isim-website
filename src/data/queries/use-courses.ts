import { getCourses } from "../api/courses";
import { queryKeys } from "../query-keys";
import { createQueryHookWithParams } from "./types";

export const useCourses = createQueryHookWithParams(
  queryKeys.courses.all,
  getCourses,
);
