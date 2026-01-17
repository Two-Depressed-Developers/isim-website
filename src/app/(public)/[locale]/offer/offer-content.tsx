"use client";

import OfferSectionTile from "@/components/custom/offer/OfferSectionTile";
import PageTitle from "@/components/PageTitle";
import { getResearchOffers } from "@/data/api/research-offers";
import { useResearchOffers } from "@/data/queries/use-research-offers";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import IconWithBackground from "@/components/custom/IconWithBackground";
import { OFFER_ICONS } from "@/consts/homepage";
import { Separator } from "@/components/ui/separator";

function OfferList() {
  const t = useTranslations("Offer");
  const locale = useLocale();
  const { data: offers } = useResearchOffers(locale);
  const [activeSection, setActiveSection] = useState<string>("");

  usePrefetchLocales(queryKeys.researchOffers.all, getResearchOffers);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-offer-id]");
      let currentSection = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.getAttribute("data-offer-id") || "";
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (offers.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        {t("notFound")}
      </div>
    );
  }

  const scrollToSection = (offerId: string) => {
    const element = document.querySelector(`[data-offer-id="${offerId}"]`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex gap-8">
      <aside className="hidden lg:block lg:w-64">
        <nav className="sticky top-8 flex flex-col gap-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {t("topics")}
          </h3>
          <ul className="space-y-2">
            {offers.map((offer, index) => (
              <li key={offer.documentId}>
                <button
                  onClick={() => scrollToSection(offer.documentId)}
                  className={cn(
                    "hover:bg-accent w-full rounded px-3 py-2 text-left text-sm transition-colors",
                    activeSection === offer.documentId
                      ? "bg-accent text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="mr-2 text-xs">{index + 1}.</span>
                  {offer.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col gap-16">
        {offers.map((offer, index) => (
          <div
            key={offer.documentId}
            data-offer-id={offer.documentId}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <IconWithBackground
                icon={OFFER_ICONS[index % OFFER_ICONS.length]}
              />
              <h2 className="font-display text-2xl font-semibold">
                {offer.title}
              </h2>
            </div>

            {offer.description && (
              <p className="text-gray-500">{offer.description}</p>
            )}

            <Separator className="bg-gray-accent" />

            {offer.offerSections && offer.offerSections.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {offer.offerSections.map((offerSection) => (
                  <OfferSectionTile
                    key={offerSection.id}
                    section={offerSection}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OfferContent() {
  const t = useTranslations("Offer");

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 pt-4 pb-8">
      <PageTitle
        title={t("title")}
        label={t("label")}
        description={t("description")}
      />
      <OfferList />
    </div>
  );
}
