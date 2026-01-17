import { ComponentHomepageCollectionFeed } from "@/types";
import PublicationTile from "@/components/custom/conferences/PublicationTile";
import CourseTile from "@/components/custom/courses/CourseTile";
import ResearchGroupTile from "@/components/custom/research-groups/ResearchGroupTile";
import ResearchOfferTile from "../research-offer/ResearchOfferTile";
import SectionHeader from "../../SectionHeader";
import { LAYOUT_COMPONENTS } from "./CollectionLayouts";
import { OFFER_ICONS } from "@/consts/homepage";

type Props = {
  data: ComponentHomepageCollectionFeed;
  preloadImg: boolean;
};

function renderItems(data: ComponentHomepageCollectionFeed) {
  const { sourceType } = data;

  switch (sourceType) {
    case "research-offer":
      return data.research_offers?.map((offer, index) => (
        <ResearchOfferTile
          key={`offer_${offer.id}`}
          offer={offer}
          icons={OFFER_ICONS.slice(index % OFFER_ICONS.length)}
        />
      ));

    case "research-group":
      return data.groups?.map((group) => (
        <ResearchGroupTile
          key={`group_${group.id}`}
          group={group}
          variant="compact"
        />
      ));

    case "conference":
      return data.conferences?.map((conference) => (
        <PublicationTile
          key={`conference_${conference.id}`}
          type="conference"
          item={conference}
          variant="compact"
        />
      ));

    case "course":
      return data.courses?.map((course) => (
        <CourseTile key={`course_${course.id}`} course={course} />
      ));

    case "journal":
      return data.journals?.map((journal) => (
        <PublicationTile
          key={`journal_${journal.id}`}
          type="journal"
          item={journal}
          variant="compact"
        />
      ));

    default:
      return null;
  }
}

export default function CollectionFeedSection({ data }: Props) {
  const LayoutComponent = LAYOUT_COMPONENTS[data.layout];

  return (
    <section className="flex flex-col gap-y-8">
      <SectionHeader
        title={data.title}
        page={data.page}
        eyebrow={data.eyebrow}
      />
      <LayoutComponent>{renderItems(data)}</LayoutComponent>
    </section>
  );
}
