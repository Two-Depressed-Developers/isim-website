import type { ImageLink, Link, Page, SimpleSection } from "./common";

export type FooterNavigationSection = {
  title: string;
  pages: {
    page: Page;
  }[];
};

export type Footer = {
  copyrightText: string;
  universityLogo: ImageLink;
  sections: SimpleSection[];
  navigation: FooterNavigationSection;
};

export type FooterData = Footer & {
  error: boolean;
};

export type Header = {
  title?: string;
  subtitle?: string;
  logo: ImageLink;
  links: Link[];
};

export type HeaderData = Header & {
  error: boolean;
};
