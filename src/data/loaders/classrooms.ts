import qs from "qs";
import axios from "axios";
import type { ClassroomResource } from "@/lib/classroom-utils";
import { flattenAttributes } from "@/lib/utils";
import { api, baseAPIUrl } from "./index";

export interface StrapiClassroomResource {
  id?: number;
  documentId?: string;
  building: string;
  roomNumber: string;
  fullRoomCode: string;
  resources: string[];
  createdAt?: string;
  updatedAt?: string;
}

export async function uploadClassroomResources(
  data: ClassroomResource[],
  accessToken: string,
): Promise<{ success: boolean; created: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;

  for (const classroom of data) {
    try {
      await axios.post(
        `${baseAPIUrl}/api/classrooms-resources`,
        { data: classroom },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      created++;
    } catch (error) {
      errors.push(
        `${classroom.fullRoomCode}: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
      );
    }
  }

  return {
    success: errors.length === 0,
    created,
    errors,
  };
}

export async function getClassroomResources(): Promise<
  StrapiClassroomResource[]
> {
  const url = new URL("/api/classrooms-resources", baseAPIUrl);

  url.search = qs.stringify({
    pagination: {
      limit: 1000,
    },
    fields: ["building", "roomNumber", "fullRoomCode", "resources"],
  });

  const response = await api.get(url.href);
  return flattenAttributes(response.data)?.data ?? [];
}
