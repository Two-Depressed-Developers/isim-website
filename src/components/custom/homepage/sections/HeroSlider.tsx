import { useCallback } from "react";
import { ComponentHomepageHeroSlider } from "@/types/strapi";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { StrapiImage } from "@/components/StrapiImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  data: ComponentHomepageHeroSlider;
};

export default function HeroSlider({ data }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();

      if (emblaApi.plugins().autoplay) {
        emblaApi.plugins().autoplay.reset();
      }
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();

      if (emblaApi.plugins().autoplay) {
        emblaApi.plugins().autoplay.reset();
      }
    }
  }, [emblaApi]);

  return (
    <div className="relative w-full">
      <div className="aspect-[3/1] w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {data.images?.map((image) => (
            <StrapiImage
              src={image.url}
              alt={image.alternativeText || "Hero Slide Image"}
              width={1920}
              height={480}
              key={image.url}
              className="h-full min-w-full object-cover"
            />
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Poprzedni slajd"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Następny slajd"
      >
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
}
