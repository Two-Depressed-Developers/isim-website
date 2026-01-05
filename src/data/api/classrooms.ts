import qs from "qs";
import { ClassroomResource, StrapiCollectionResponse } from "@/types";
import { fetchData, baseAPIUrl, api } from "./base";

export async function getClassroomResources(): Promise<ClassroomResource[]> {
  const url = new URL("/api/classrooms-resources", baseAPIUrl);

  url.search = qs.stringify({
    pagination: {
      limit: 1000,
    },
    fields: ["building", "roomNumber", "fullRoomCode", "resources"],
  });

  const response = await fetchData<StrapiCollectionResponse<ClassroomResource>>(
    url.href,
  );
  return response.data;
}

export async function uploadClassroomResources(
  data: ClassroomResource[],
  accessToken: string,
): Promise<{ success: boolean; created: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;

  try {
    const existing = await getClassroomResources();
    for (const resource of existing) {
      if (resource.documentId) {
        await api.delete(`/api/classrooms-resources/${resource.documentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    }
  } catch (error) {
    errors.push(
      `Błąd podczas czyszczenia kolekcji: ${
        error instanceof Error ? error.message : "Nieznany błąd"
      }`,
    );
  }

  for (const classroom of data) {
    try {
      await api.post(
        "/api/classrooms-resources",
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
        `${classroom.fullRoomCode}: ${
          error instanceof Error ? error.message : "Nieznany błąd"
        }`,
      );
    }
  }

  return {
    success: errors.length === 0,
    created,
    errors,
  };
}
