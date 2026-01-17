import { useCallback, useEffect, useState } from "react";
import { ComponentHomepageHeroSlider } from "@/types";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { StrapiImage } from "@/components/StrapiImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import CustomLink from "@/components/CustomLink";

type Props = {
  data: ComponentHomepageHeroSlider;
  preloadImg: boolean;
};

export default function HeroSlider({ data, preloadImg: preloadImg }: Props) {
  const t = useTranslations("HomePage.heroSlider");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);

        if (emblaApi.plugins().autoplay) {
          emblaApi.plugins().autoplay.reset();
        }
      }
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const hasMultipleSlides = data.slides && data.slides.length > 1;

  return (
    <div className="relative w-full">
      <div
        className="aspect-[1/1] max-h-[500px] min-h-96 w-full overflow-hidden lg:aspect-[2/1] lg:max-h-[900px]"
        ref={emblaRef}
      >
        <div className="flex h-full bg-black text-white">
          {data.slides?.map((slide, index) => (
            <div key={slide.photo.url} className="relative h-full min-w-full">
              <StrapiImage
                imageLink={slide.photo.url}
                alt={slide.photo.alternativeText ?? ""}
                fill
                preload={preloadImg && index === 0}
                sizes="(max-width: 1280px) 100vw, 1920px"
                loading={!preloadImg || index != 0 ? "lazy" : "eager"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex max-w-3/4 flex-col gap-4 text-left">
                    {slide.title && (
                      <h1 className="font-display text-3xl font-semibold text-white drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="line-clamp-3 text-sm text-white drop-shadow-lg md:text-base lg:text-lg xl:text-xl">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.cta && (
                      <div className="mt-2">
                        <CustomLink
                          href={slide.cta.URL}
                          isExternal={slide.cta.isExternal}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-x-1 px-4 py-2 font-medium shadow-lg transition-colors"
                        >
                          {slide.cta.label}
                          <ChevronRight className="size-5 shrink-0" />
                        </CustomLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {hasMultipleSlides && (
        <div className="absolute right-0 bottom-6 left-0 flex items-center justify-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none border border-white/50 bg-white/10 text-white hover:bg-white/5 hover:text-white"
            onClick={scrollPrev}
            aria-label={t("prevSlide")}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">{t("prevSlide")}</span>
          </Button>
          <div className="flex gap-2">
            {data.slides?.map((_, index) => (
              <Button
                key={index}
                className={cn(
                  "h-1.5 w-10 rounded-none p-0 transition-all",
                  index === selectedIndex
                    ? "bg-white hover:bg-white/90"
                    : "bg-white/50 hover:bg-white/70",
                )}
                onClick={() => scrollTo(index)}
                aria-label={`${t("goToSlide")} ${index + 1}`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none border border-white/50 bg-white/10 text-white hover:bg-white/5 hover:text-white"
            onClick={scrollNext}
            aria-label={t("nextSlide")}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">{t("nextSlide")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
