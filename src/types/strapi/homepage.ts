import type { Image, Page, SimpleLink } from "./common";
import type { Conference } from "./conference";
import type { Course } from "./course";
import type { Group } from "./group";
import type { Journal } from "./journal";
import type { Member } from "./member";
import type { ResearchOffer } from "./offer";

export type CollectionSourceType =
  | "research-offer"
  | "research-group"
  | "conference"
  | "course"
  | "journal";
export type CollectionLayout = "row_3" | "grid_2x2" | "list";
export type CollectionSelectionMode = "newest" | "random" | "manual";

export type ComponentHomepageHeroSlider = {
  id: number;
  __component: "homepage.hero-slider";
  images: Image[];
};

export type ComponentHomepageSupervisors = {
  id: number;
  __component: "homepage.supervisors";
  title?: string;
  description?: string;
  members: Member[];
};

export type ComponentHomepageCollaborationItem = {
  id: number;
  name: string;
  link?: SimpleLink;
  logo: Image;
};

export type ComponentHomepageCollaborations = {
  id: number;
  __component: "homepage.collaborations";
  title?: string;
  description?: string;
  items: ComponentHomepageCollaborationItem[];
};

export type ComponentHomepageGroupItem = {
  id: number;
  name: string;
  description?: string;
  image: Image;
  link?: SimpleLink;
};

export type ComponentHomepageStudentGroups = {
  id: number;
  __component: "homepage.student-groups";
  title?: string;
  groups: ComponentHomepageGroupItem[];
};

export type ComponentHomepageCollectionFeed = {
  id: number;
  __component: "homepage.collection-feed";
  title?: string;
  sourceType: CollectionSourceType;
  layout: CollectionLayout;
  selectionMode: CollectionSelectionMode;
  page?: Page;

  research_offers?: ResearchOffer[];
  groups?: Group[];
  conferences?: Conference[];
  courses?: Course[];
  journals?: Journal[];
};

export type HomepageSection =
  | ComponentHomepageHeroSlider
  | ComponentHomepageSupervisors
  | ComponentHomepageCollaborations
  | ComponentHomepageStudentGroups
  | ComponentHomepageCollectionFeed;

export type HomepageData = {
  id: number;
  documentId: string;
  sections: HomepageSection[];
  createdAt: string;
  updatedAt: string;
};
