import { ComponentHomepageCollaborations } from "@/types/strapi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import SectionHeader from "../../SectionHeader";
import CollaborationItem from "./CollaborationItem";

type Props = {
  data: ComponentHomepageCollaborations;
};

export default function CollaborationsSection({ data }: Props) {
  const items = data.items ?? [];

  const minItems = 10;
  const multiplier = items.length > 0 ? Math.ceil(minItems / items.length) : 1;
  const duplicatedItems = Array(multiplier).fill(items).flat();

  return (
    <section>
      <SectionHeader
        title={data.title}
        description={data.description}
        className="mb-8"
      />
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
