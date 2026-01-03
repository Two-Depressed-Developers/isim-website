export type StrapiBaseItem = {
  createdAt?: string;
  publishedAt?: string;
};

export type Pagination = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
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

export type Page = {
  name: string;
  slug: string;
};
