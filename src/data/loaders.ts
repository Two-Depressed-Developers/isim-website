import qs from "qs";

import { getStrapiURL, flattenAttributes } from "@/lib/utils";
import type {
  FooterData,
  GroupData,
  HeaderData,
  MemberData,
} from "@/lib/types";

const baseAPIUrl = getStrapiURL();

export async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
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
