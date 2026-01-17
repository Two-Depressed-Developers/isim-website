import { ComponentHomepageHeroSlider } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import CustomLink from "@/components/CustomLink";
import SliderButton from "./SliderButton";
import { useHeroCarousel } from "@/hooks/use-hero-slider";

type Props = {
  data: ComponentHomepageHeroSlider;
  preloadImg: boolean;
};

export default function HeroSlider({ data, preloadImg }: Props) {
  const t = useTranslations("HomePage.heroSlider");
  const { emblaRef, selectedIndex, scrollPrev, scrollNext, scrollTo } =
    useHeroCarousel(5000);

  const slides = data.slides || [];
  const hasMultipleSlides = slides.length > 1;

  return (
    <div className="relative w-full">
      <div
        className="aspect-square max-h-[500px] min-h-96 w-full overflow-hidden lg:aspect-[2/1] lg:max-h-[900px]"
        ref={emblaRef}
      >
        <div className="flex h-full bg-black text-white">
          {slides.map((slide, index) => (
            <div key={slide.photo.url} className="relative h-full min-w-full">
              <StrapiImage
                imageLink={slide.photo.url}
                alt={slide.photo.alternativeText ?? ""}
                fill
                preload={preloadImg && index === 0}
                sizes="(max-width: 1280px) 100vw, 1920px"
                loading={preloadImg && index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex max-w-3xl flex-col gap-4">
                    {slide.title && (
                      <h1 className="font-display text-3xl font-semibold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="line-clamp-3 text-base text-white/90 drop-shadow-lg md:text-lg lg:text-xl">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.cta && (
                      <CustomLink
                        href={slide.cta.URL}
                        isExternal={slide.cta.isExternal}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex w-fit items-center gap-x-1 px-6 py-3 font-medium shadow-lg transition-colors"
                      >
                        {slide.cta.label}
                        <ChevronRight className="size-5 shrink-0" />
                      </CustomLink>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 px-4">
          <SliderButton onClick={scrollPrev} label={t("prevSlide")}>
            <ChevronLeft className="size-5" />
          </SliderButton>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1.5 w-10 transition-all duration-300",
                  index === selectedIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70",
                )}
                aria-label={`${t("goToSlide")} ${index + 1}`}
              />
            ))}
          </div>

          <SliderButton onClick={scrollNext} label={t("nextSlide")}>
            <ChevronRight className="size-5" />
          </SliderButton>
        </div>
      )}
    </div>
  );
}
