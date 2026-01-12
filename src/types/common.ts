export type StrapiBaseItem = {
  createdAt?: string;
  publishedAt?: string;
};

export type SimpleLink = {
  id: number;
  URL: string;
  label: string;
  isExternal: boolean;
  openInNewWindow: boolean;
};

export type Link = {
  id: number;
  URL: string;
  label: string;
  isExternal: boolean;
  openInNewWindow: boolean;
  subLinks?: Link[];
  page?: Page;
};

export type Page = {
  id: number;
  name: string;
  slug: string;
};

export type ImageLink = {
  id: number;
  alt: string;
  image: {
    url: string;
  };
  link: Link;
};

export type Image = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
};

export type SimpleSection = {
  id: number;
  title: string;
  text: string;
  images: ImageLink[];
  cta?: Link;
};
