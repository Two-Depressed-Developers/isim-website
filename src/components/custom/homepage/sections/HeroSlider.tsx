import { useCallback } from "react";
import { ComponentHomepageHeroSlider } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { StrapiImage } from "@/components/StrapiImage";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-4 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
        onClick={scrollPrev}
        aria-label="Poprzedni slajd"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Poprzedni slajd</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-4 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
        onClick={scrollNext}
        aria-label="Następny slajd"
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Następny slajd</span>
      </Button>
    </div>
  );
}
