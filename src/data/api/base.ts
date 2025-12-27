import axios from "axios";
import { getStrapiURL, flattenAttributes } from "@/lib/utils";

export const baseAPIUrl = getStrapiURL();

export const api = axios.create({
  baseURL: baseAPIUrl,
});

export async function fetchData(url: string, accessToken?: string) {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;

  const response = await api.get(url, { headers });

  return flattenAttributes(response.data);
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
