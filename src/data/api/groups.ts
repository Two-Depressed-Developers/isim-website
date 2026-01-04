import qs from "qs";
import type { Group, StrapiCollectionResponse } from "@/types";
import { fetchData, baseAPIUrl } from "./base";

export async function getGroupsData(locale: string): Promise<Group[]> {
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
      siteLink: true,
      badapLink: true,
      supervisor: populateOptions,
      members: populateOptions,
    },
    locale,
  });

  const response = await fetchData<StrapiCollectionResponse<Group>>(url.href);
  return response?.data ?? [];
}
