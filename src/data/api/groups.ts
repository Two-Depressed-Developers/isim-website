import qs from "qs";
import type { GroupData } from "@/lib/types";
import { fetchData, baseAPIUrl, api } from "./base";

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
      siteLink: true,
      badapLink: true,
      supervisor: populateOptions,
      members: populateOptions,
    },
  });

  return await fetchData(url.href);
}
