import axios from "axios";
import { getStrapiURL, flattenAttributes } from "@/lib/utils";

export const baseAPIUrl = getStrapiURL();

export const api = axios.create({
  baseURL: baseAPIUrl,
});

export async function fetchData<T>(
  url: string,
  accessToken?: string,
): Promise<T> {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;

  try {
    const response = await api.get(url, { headers });
    return flattenAttributes<T>(response.data);
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null as T;
  }
}

export async function uploadFile(
  file: File,
  accessToken: string,
  linkOptions?: {
    ref: string;
    refId: string;
    field: string;
  },
): Promise<{ id: number; documentId: string; url: string }> {
  const formData = new FormData();
  formData.append("files", file);

  if (linkOptions) {
    formData.append("ref", linkOptions.ref);
    formData.append("refId", linkOptions.refId);
    formData.append("field", linkOptions.field);
  }

  const response = await axios.post(`${baseAPIUrl}/api/upload`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data[0];
}
