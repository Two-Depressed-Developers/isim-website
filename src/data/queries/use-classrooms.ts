import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  getClassroomResources,
  uploadClassroomResources,
} from "../api/classrooms";
import { ClassroomResource } from "@/types";

export function useClassroomResources() {
  return useQuery({
    queryKey: queryKeys.classrooms.all,
    queryFn: getClassroomResources,
  });
}

export function useUploadClassroomResources() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      accessToken,
    }: {
      data: ClassroomResource[];
      accessToken: string;
    }) => uploadClassroomResources(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all });
    },
  });
}
