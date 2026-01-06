import type { FooterData, HeaderData } from "@/types";

export const HARDCODED_DATA: Record<
  string,
  { header: HeaderData; footer: FooterData }
> = {
  pl: {
    header: {
      error: false,
      logo: {
        id: 52,
        alt: "Katedra Informatyki Stosowanej i Modelowania",
        image: { url: "logo.png" },
        link: {
          id: 203,
          URL: "/",
          isExternal: false,
          label: "Strona główna",
          openInNewWindow: false,
          page: undefined,
        },
      },
      links: [
        {
          id: 204,
          URL: "/offer",
          label: "Oferta naukowa",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 205,
          URL: "/research-groups",
          label: "Grupy badawcze",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 206,
          URL: "/staff",
          label: "Pracownicy",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 207,
          URL: "/classrooms",
          label: "Pracownie",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 208,
          URL: "/calendar",
          label: "Kalendarz",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 209,
          URL: "/courses",
          label: "Kierunki",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 210,
          URL: "/conferences",
          label: "Konferencje & czasopisma",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 211,
          URL: "/helpdesk",
          label: "Helpdesk",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 212,
          URL: "/contact",
          label: "Kontakt",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
      ],
    },
    footer: {
      error: false,
      copyrightText:
        "Wszystkie prawa zastrzeżone © {currentYear} Akademia Górniczo-Hutnicza ",
      universityLogo: {
        id: 53,
        alt: "Akademia Górniczo Hutnicza AGH Logo",
        image: { url: "agh_logo.png" },
        link: {
          id: 213,
          URL: "https://www.agh.edu.pl/",
          isExternal: true,
          label: "",
          openInNewWindow: true,
        },
      },
      sections: [
        {
          id: 38,
          title: "Adres:",
          text:
            "ul. Test 11  \n" +
            "30-055 Kraków, Polska  \n" +
            "tel: +48 12 111-11-11  \n" +
            "fax: +48 12 111-11-11",
          images: [],
          cta: undefined,
        },
        {
          id: 39,
          title: "Znajdź nas tutaj:",
          text: "",
          images: [
            {
              id: 1,
              alt: "Facebook",
              image: { url: "fb_logo.png" },
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
    },
  },
  en: {
    header: {
      error: false,
      logo: {
        id: 49,
        alt: "Department of Applied Computer Science and Modeling",
        image: { url: "logo.png" },
        link: {
          id: 191,
          URL: "/",
          isExternal: false,
          label: "Home",
          openInNewWindow: false,
          page: undefined,
        },
      },
      links: [
        {
          id: 192,
          URL: "/offer",
          label: "Research Offer",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 193,
          URL: "/research-groups",
          label: "Research Teams",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 194,
          URL: "/staff",
          label: "Staff",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 195,
          URL: "/classrooms",
          label: "Classrooms",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 196,
          URL: "/calendar",
          label: "Calendar",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 197,
          URL: "/courses",
          label: "Courses",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 198,
          URL: "/conferences",
          label: "Conferences & Journals",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 199,
          URL: "/helpdesk",
          label: "Helpdesk",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
        {
          id: 200,
          URL: "/contact",
          label: "Contact",
          isExternal: false,
          openInNewWindow: false,
          subLinks: [],
          page: undefined,
        },
      ],
    },
    footer: {
      error: false,
      copyrightText:
        "All rights reserved © {currentYear} Akademia Górniczo-Hutnicza ",
      universityLogo: {
        id: 50,
        alt: "Akademia Górniczo Hutnicza AGH Logo",
        image: { url: "agh_logo.png" },
        link: {
          id: 201,
          URL: "https://www.agh.edu.pl/",
          isExternal: true,
          label: "",
          openInNewWindow: true,
        },
      },
      sections: [
        {
          id: 36,
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
          id: 37,
          title: "Find us here:",
          text: "",
          images: [
            {
              id: 1,
              alt: "Facebook",
              image: { url: "fb_logo.png" },
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
    },
  },
};
