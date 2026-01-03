import qs from "qs";
import type { Group } from "@/types/strapi";
import { fetchData, baseAPIUrl, api } from "./base";

export async function getGroupsData(): Promise<Group[]> {
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
  });

  const response = await fetchData(url.href);
  return response?.data ?? [];
}
