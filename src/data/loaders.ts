import qs from "qs";

import { getStrapiURL, flattenAttributes } from "@/lib/utils";

const baseAPIUrl = getStrapiURL();

async function fetchData(url: string) {
  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url);
    const data = await response.json();
    return flattenAttributes(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getGroupsData() {
  const url = new URL("/api/groups", baseAPIUrl);

  const populateOptions = {
    fields: ["firstName", "lastName", "title", "phone", "email"],
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
