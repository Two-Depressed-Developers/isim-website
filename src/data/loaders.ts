import qs from "qs";

import { getStrapiURL, flattenAttributes } from "@/lib/utils";
import type { GroupData, MemberData } from "@/lib/types";

const baseAPIUrl = getStrapiURL();

async function fetchData(url: string) {
  // const headers = {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // };

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
    fields: ["firstName", "lastName", "title", "phone", "email", "position"],
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
      supervisor: populateOptions,
      members: populateOptions,
    },
  });

  return await fetchData(url.href);
}

export async function getMemberData(id: string): Promise<MemberData> {
  const url = new URL(`/api/members/${id}`, baseAPIUrl);

  const populateOptions = {
    fields: ["firstName", "lastName", "title", "phone", "email"],
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
    Research: {
      populate: {
        PublicationsLink: {
          populate: true,
        },
        ORCIDLink: {
          populate: true,
        },
        ResearchgateLink: {
          populate: true,
        },
        ReasercherIdLink: {
          populate: true,
        },
      },
    },
  };

  url.search = qs.stringify({
    populate: populateOptions,
  });

  return await fetchData(url.href);
}
