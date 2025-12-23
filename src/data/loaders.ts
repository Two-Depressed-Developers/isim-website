import qs from "qs";
import axios from "axios";

import { getStrapiURL, flattenAttributes } from "@/lib/utils";
import type { CalendarEvent, GroupData, MemberData } from "@/lib/types";

const baseAPIUrl = getStrapiURL();

const api = axios.create({
  baseURL: baseAPIUrl,
});

export async function fetchData(url: string) {
  const response = await api.get(url);

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

export async function getGroupsData(): Promise<GroupData> {
  const url = new URL("/api/groups", baseAPIUrl);

  const populateOptions = {
    fields: ["fullName", "slug", "title", "phone", "email", "position"],
    populate: {
      photo: {
        fields: ["url", "alternativeText"],
      },
      USOSLink: {
        populate: true,
      },
      BADAPLink: {
        populate: true,
      },
      SKOSLink: {
        populate: true,
      },
    },
  };

  url.search = qs.stringify({
    populate: {
      link: true,
      supervisor: populateOptions,
      members: populateOptions,
    },
  });

  return await fetchData(url.href);
}

export async function getMemberData(slug: string): Promise<MemberData> {
  const url = new URL(`/api/members`, baseAPIUrl);

  const populateOptions = {
    fields: ["fullName", "slug", "title", "phone", "email", "room", "position"],
    photo: {
      fields: ["url", "alternativeText"],
    },
    USOSLink: {
      populate: true,
    },
    BADAPLink: {
      populate: true,
    },
    SKOSLink: {
      populate: true,
    },
    PortfolioLink: {
      populate: true,
    },
    sections: true,
  };

  url.search = qs.stringify({
    populate: populateOptions,
    filters: {
      slug: slug,
    },
  });

  const response = await fetchData(url.href);

  return response?.data?.[0] ?? ({ error: true } as MemberData);
}

export async function getMemberSchema(): Promise<Record<string, unknown>> {
  const contentTypeId = "api::member.member";
  const url = new URL(`/api/schemas/${contentTypeId}`, baseAPIUrl);

  return await fetchData(url.href);
}

export async function updateMember(
  documentId: string,
  data: Partial<MemberData>,
  accessToken: string,
): Promise<MemberData> {
  try {
    const response = await axios.put(
      `${baseAPIUrl}/api/members/${documentId}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return flattenAttributes(response.data);
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const url = new URL("/api/calendar-events", baseAPIUrl);

  const populateOptions = {
    fields: ["title", "startDate", "endDate", "description", "color"],
  };

  url.search = qs.stringify({
    populate: populateOptions,
  });

  const response = await fetchData(url.href);

  return response?.data ?? [];
}
