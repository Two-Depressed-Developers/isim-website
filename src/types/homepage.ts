import { SimpleLink, Image, Page, Link } from "./common";
import { Conference, Course, Journal, ResearchOffer } from "./content";
import { Group } from "./group";
import { Member } from "./member";

export type CollectionSourceType =
  | "research-offer"
  | "research-group"
  | "conference"
  | "course"
  | "journal";
export type CollectionLayout = "row_3" | "grid_2x2" | "list";
export type CollectionSelectionMode = "newest" | "random" | "manual";

export type ComponentHeroSliderSection = {
  id: number;
  title?: string;
  subtitle?: string;
  photo: Image;
  cta?: Link;
};

export type ComponentHomepageHeroSlider = {
  id: number;
  __component: "homepage.hero-slider";
  slides: ComponentHeroSliderSection[];
};

export type ComponentHomepageSupervisorCard = {
  id: number;
  role: string;
  member: Member;
};

export type ComponentHomepageSupervisors = {
  id: number;
  __component: "homepage.supervisors";
  eyebrow?: string;
  title?: string;
  description?: string;
  supervisors?: ComponentHomepageSupervisorCard[];
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
  eyebrow?: string;
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
  eyebrow?: string;
  title?: string;
  groups: ComponentHomepageGroupItem[];
};

export type ComponentHomepageCollectionFeed = {
  id: number;
  __component: "homepage.collection-feed";
  eyebrow?: string;
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
