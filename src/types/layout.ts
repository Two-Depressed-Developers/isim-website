import type { ImageLink, Link, SimpleSection } from "./common";

export type Footer = {
  copyrightText: string;
  universityLogo: ImageLink;
  sections: SimpleSection[];
};

export type FooterData = Footer & {
  error: boolean;
};

export type Header = {
  logo: ImageLink;
  links: Link[];
};

export type HeaderData = Header & {
  error: boolean;
};
