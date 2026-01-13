import type { FooterData, HeaderData, Page } from "@/types";
import qs from "qs";
import { fetchData } from "./api/base";
import { getStrapiURL } from "@/lib/utils";
import { HARDCODED_DATA } from "@/consts/layout";

const baseAPIUrl = getStrapiURL();

type GlobalPageResponse = {
  header?: HeaderData;
  footer?: FooterData;
  error?: boolean;
};

type PagesResponse = {
  data: Page[];
};

const getFallbackData = (locale: string) =>
  HARDCODED_DATA[locale] || HARDCODED_DATA["pl"];

export async function getHeaderData(locale: string) {
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

  url.search = qs.stringify({ populate: populateOptions, locale });

  try {
    const data = await fetchData<GlobalPageResponse>(url.href);
    return data?.header ?? getFallbackData(locale).header;
  } catch {
    return getFallbackData(locale).header;
  }
}

export async function getFooterData(locale: string) {
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
        navigation: {
          populate: {
            pages: {
              populate: {
                page: true,
              },
            },
          },
        },
      },
    },
  };

  url.search = qs.stringify({ populate: populateOptions, locale });

  try {
    const data = await fetchData<GlobalPageResponse>(url.href);
    return data?.footer ?? getFallbackData(locale).footer;
  } catch {
    return getFallbackData(locale).footer;
  }
}

export async function getPagesData(locale: string) {
  const url = new URL("/api/pages", baseAPIUrl);

  const populateOptions = {
    fields: ["name", "slug"],
  };

  url.search = qs.stringify({
    populate: populateOptions,
    locale,
  });

  try {
    const response = await fetchData<PagesResponse>(url.href);
    return response?.data ?? [];
  } catch {
    return [];
  }
}
