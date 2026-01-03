import { HomepageData } from "@/types/strapi";
import { baseAPIUrl, fetchData } from "./base";
import qs from "qs";
import { API_ITEM_KEYS } from "@/consts/common";

const HOMEPAGE_POPULATE = {
  sections: {
    on: {
      "homepage.hero-slider": {
        populate: {
          images: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      "homepage.supervisors": {
        populate: {
          members: {
            populate: {
              photo: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
      "homepage.collaborations": {
        populate: {
          items: {
            populate: {
              logo: {
                fields: ["url", "alternativeText"],
              },
              link: {
                populate: "*",
              },
            },
          },
        },
      },
      "homepage.student-groups": {
        populate: {
          groups: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
              link: {
                populate: "*",
              },
            },
          },
        },
      },
      "homepage.collection-feed": {
        populate: {
          research_offers: true,
          groups: {
            populate: {
              members: true,
            },
          },
          conferences: true,
          courses: true,
          journals: true,
          page: true,
        },
      },
    },
  },
};

export const getHomepage = async () => {
  const url = new URL(`/api/homepage`, baseAPIUrl);

  url.search = qs.stringify({
    populate: HOMEPAGE_POPULATE,
  });

  const response = await fetchData(url.href);

  return response as HomepageData;
};

export async function getHomepageSchema(): Promise<Record<string, unknown>> {
  const url = new URL(
    `/api/schemas/deep/${API_ITEM_KEYS.HOMEPAGE}`,
    baseAPIUrl,
  );

  return await fetchData(url.href);
}
