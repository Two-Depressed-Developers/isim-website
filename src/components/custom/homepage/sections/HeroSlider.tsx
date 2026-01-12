import { useCallback } from "react";
import { ComponentHomepageHeroSlider } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { StrapiImage } from "@/components/StrapiImage";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  data: ComponentHomepageHeroSlider;
  preloadImg: boolean;
};

export default function HeroSlider({ data, preloadImg: preloadImg }: Props) {
  const t = useTranslations("HomePage.heroSlider");
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
          {data.images?.map((image, index) => (
            <div key={image.url} className="relative h-full min-w-full">
              <StrapiImage
                imageLink={image.url}
                alt={image.alternativeText || "Hero Slide Image"}
                fill
                preload={preloadImg && index === 0}
                sizes="(max-width: 1280px) 100vw, 1920px"
                loading={!preloadImg || index != 0 ? "lazy" : "eager"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {data.images && data.images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
            onClick={scrollPrev}
            aria-label={t("prevSlide")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t("prevSlide")}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
            onClick={scrollNext}
            aria-label={t("nextSlide")}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">{t("nextSlide")}</span>
          </Button>
        </>
      )}
    </div>
  );
}
