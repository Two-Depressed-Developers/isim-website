import { FooterData, HeaderData } from "@/lib/types";
import qs from "qs";
import { fetchData } from "./loaders";
import { getStrapiURL } from "@/lib/utils";
import { isExternal } from "util/types";

const baseAPIUrl = getStrapiURL();

const getHardcodedHeaderData = (): HeaderData => {
  return {
    error: true,
    logo: {
      id: 1,
      image: {
        url: "logo.png",
      },
      alt: "Department of Applied Computer Science and Modelling Logo",
      link: {
        id: 1,
        URL: "/",
        isExternal: false,
        openInNewWindow: false,
        label: "Homepage",
        page: {
          name: "Homepage",
          slug: "/",
        },
      },
    },
    links: [
      {
        id: 1,
        label: "About us",
        URL: "/about-us",
        isExternal: false,
        openInNewWindow: false,
        page: {
          name: "About us",
          slug: "/about-us",
        },
        subLinks: [
          {
            id: 1,
            label: "Faculty and staff",
            URL: "/staff",
            isExternal: false,
            openInNewWindow: false,
            page: {
              name: "Faculty and staff",
              slug: "/staff",
            },
          },
          {
            id: 2,
            label: "Head of Department",
            URL: "/head-of-department",
            isExternal: false,
            openInNewWindow: false,
            page: {
              name: "Head of Department",
              slug: "/head-of-department",
            },
          },
          {
            id: 3,
            label: "Historical overview",
            URL: "/historical-overview",
            isExternal: false,
            openInNewWindow: false,
            page: {
              name: "Historical overview",
              slug: "/historical-overview",
            },
          },
        ],
      },
      {
        id: 2,
        label: "Contact",
        URL: "/contact",
        isExternal: false,
        openInNewWindow: false,
        page: {
          name: "Contact",
          slug: "/contact",
        },
        subLinks: [],
      },
    ],
  };
};

const getHardcodedFooterData = (): FooterData => {
  return {
    error: true,
    universityLogo: {
      id: 1,
      image: {
        url: "agh_logo.png",
      },
      alt: "AGH University of Krakow Logo",
      link: {
        id: 1,
        URL: "https://www.agh.edu.pl",
        isExternal: true,
        openInNewWindow: true,
        label: "",
      },
    },
    copyrightText: "All rights reserver © 2025 Akademia Górniczo-Hutnicza",
    sections: [
      {
        id: 1,
        title: "Address:",
        text:
          "ul. Test 11  \n" +
          "30-055 Kraków, Polska  \n" +
          "tel: +48 12 111-11-11  \n" +
          "fax: +48 12 111-11-11",
        images: [],
        cta: undefined,
      },
      {
        id: 2,
        title: "Find us here: ",
        text: "",
        images: [
          {
            id: 1,
            alt: "Facebook icon",
            image: {
              url: "fb_logo.png",
            },
            link: {
              id: 60,
              URL: "https://www.facebook.com/kisim.agh",
              isExternal: true,
              label: "Facebook",
              openInNewWindow: true,
            },
          },
        ],
        cta: undefined,
      },
    ],
  };
};

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
    if (data.error) {
      return getHardcodedHeaderData();
    }
    return { ...data.header, error: data.error != null } as HeaderData;
  } catch (error) {
    return getHardcodedHeaderData();
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
    if (data.error) {
      return getHardcodedFooterData();
    }
    return { ...data.footer, error: data.error != null } as FooterData;
  } catch (error) {
    return getHardcodedFooterData();
  }
}
