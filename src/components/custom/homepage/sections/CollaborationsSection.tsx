import {
  ComponentHomepageCollaborationItem,
  ComponentHomepageCollaborations,
} from "@/lib/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ExternalLink } from "lucide-react";

type Props = {
  data: ComponentHomepageCollaborations;
};

function CollaborationItem({
  item,
}: {
  item: ComponentHomepageCollaborationItem;
}) {
  const content = (
    <div className="group relative flex h-32 w-full items-center justify-center rounded-xl bg-white p-4 shadow-md transition-transform hover:scale-105">
      <StrapiImage
        src={item.logo.url}
        alt={item.logo.alternativeText || item.name}
        width={120}
        height={60}
        className="h-full w-full object-contain"
      />
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex items-center justify-center gap-1.5 px-2 text-center text-sm font-semibold text-white">
          {item.name}
          {item.link?.URL && (
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          )}
        </span>
      </div>
    </div>
  );

  if (item.link?.URL) {
    return (
      <CustomLink
        href={item.link.URL}
        isExternal={item.link.isExternal ?? true}
      >
        {content}
      </CustomLink>
    );
  }

  return content;
}

export default function CollaborationsSection({ data }: Props) {
  const items = data.items ?? [];

  const minItems = 10;
  const multiplier = items.length > 0 ? Math.ceil(minItems / items.length) : 1;
  const duplicatedItems = Array(multiplier).fill(items).flat();

  return (
    <section>
      <h2 className="mb-4 text-3xl font-bold">{data.title}</h2>
      {data.description && (
        <p className="mb-8 text-gray-600">{data.description}</p>
      )}
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full px-6"
      >
        <CarouselContent className="ml-1">
          {duplicatedItems.map((item, index) => (
            <CarouselItem
              key={`${item.id}-${index}`}
              className="basis-1/1 p-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <CollaborationItem item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-1/2" />
        <CarouselNext className="right-0 translate-x-1/2" />
      </Carousel>
    </section>
  );
}
