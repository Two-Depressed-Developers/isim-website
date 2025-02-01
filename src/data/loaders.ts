import qs from "qs";

import { getStrapiURL, flattenAttributes } from "@/lib/utils";
import type {
  FooterData,
  GroupData,
  HeaderData,
  MemberData,
} from "@/lib/types";

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

export async function getHeaderData() {
  const url = new URL("/api/global-page", baseAPIUrl);

  const populateOptions = {
    header: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ["url"],
            },
            link: {
              populate: {
                page: true,
              },
            },
          },
        },
        links: {
          populate: {
            subLinks: true,
            page: true,
          },
        },
      },
    },
  };

  url.search = qs.stringify({ populate: populateOptions });

  try {
    const data = await fetchData(url.href);
    return { ...data.header, error: false } as HeaderData;
  } catch (error) {
    return { error: true } as HeaderData;
  }
}

export async function getFooterData() {
  const url = new URL("/api/global-page", baseAPIUrl);

  const populateOptions = {
    footer: {
      populate: {
        universityLogo: {
          populate: {
            image: {
              fields: ["url"],
            },
            link: true,
          },
        },
        sections: {
          populate: {
            images: {
              populate: {
                image: {
                  fields: ["url"],
                },
                link: true,
              },
            },
            cta: true,
          },
        },
      },
    },
  };

  url.search = qs.stringify({ populate: populateOptions });

  try {
    const data = await fetchData(url.href);
    return { ...data.footer, error: false } as FooterData;
  } catch (error) {
    return { error: true } as FooterData;
  }
}
