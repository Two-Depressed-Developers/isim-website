export type SectionFeatureItem = {
  id: number;
  value?: string;
};

export type OfferSection = {
  id: number;
  sectionTitle: string;
  features?: SectionFeatureItem[];
};

export type ResearchOffer = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  offerSections?: OfferSection[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};
