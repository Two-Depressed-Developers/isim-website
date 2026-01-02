import {
  CollectionLayout,
  CollectionSourceType,
  ComponentHomepageCollectionFeed,
  Page,
} from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import CustomLink from "@/components/CustomLink";
import PublicationTile from "@/components/custom/conferences/PublicationTile";
import CourseTile from "@/components/custom/courses/CourseTile";
import ResearchGroupTile from "@/components/custom/research-groups/ResearchGroupTile";
import { ExternalLink } from "lucide-react";
import ResearchOfferTile from "./tiles/ResearchOfferTile";

type Props = {
  data: ComponentHomepageCollectionFeed;
};

function SectionHeader({ title, page }: { title?: string; page?: Page }) {
  const displayTitle = title;

  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="text-3xl font-bold">{displayTitle}</h2>
      {page && (
        <>
          <Separator
            orientation="vertical"
            className="bg-primary h-8 w-1 rounded"
          />
          <CustomLink
            href={page.slug ? `/${page.slug}` : "/"}
            isExternal={false}
            className="text-primary flex items-center gap-2 hover:underline"
          >
            Zobacz więcej <ExternalLink className="inline-block h-4 w-4" />
          </CustomLink>
        </>
      )}
    </div>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

function RowLayout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{children}</div>
  );
}

function GridLayout({ children }: LayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
  );
}

function ListLayout({ children }: LayoutProps) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

const LAYOUT_COMPONENTS: Record<CollectionLayout, React.FC<LayoutProps>> = {
  row_3: RowLayout,
  grid_2x2: GridLayout,
  list: ListLayout,
};

function renderItems(data: ComponentHomepageCollectionFeed) {
  const { sourceType } = data;

  switch (sourceType) {
    case "research-offer":
      return data.research_offers?.map((offer) => (
        <ResearchOfferTile key={offer.id} offer={offer} />
      ));

    case "research-group":
      return data.groups?.map((group) => (
        <ResearchGroupTile key={group.id} group={group} variant="compact" />
      ));

    case "conference":
      return data.conferences?.map((conference) => (
        <PublicationTile
          key={conference.id}
          type="conference"
          item={conference}
          variant="compact"
        />
      ));

    case "course":
      return data.courses?.map((course) => (
        <CourseTile key={course.id} course={course} variant="compact" />
      ));

    case "journal":
      return data.journals?.map((journal) => (
        <PublicationTile
          key={journal.id}
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
    <section>
      <SectionHeader title={data.title} page={data.page} />
      <LayoutComponent>{renderItems(data)}</LayoutComponent>
    </section>
  );
}
