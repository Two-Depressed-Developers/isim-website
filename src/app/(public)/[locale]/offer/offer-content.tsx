"use client";

import OfferSectionTile from "@/components/custom/offer/OfferSectionTile";
import PageTitle from "@/components/PageTitle";
import { getResearchOffers } from "@/data/api/research-offers";
import { useResearchOffers } from "@/data/queries/use-research-offers";
import { queryKeys } from "@/data/query-keys";
import { usePrefetchLocales } from "@/hooks/use-prefetch-locales";
import { useLocale, useTranslations } from "next-intl";

function OfferList() {
  const t = useTranslations("Offer");
  const locale = useLocale();
  const { data: offers } = useResearchOffers(locale);

  usePrefetchLocales(queryKeys.researchOffers.all, getResearchOffers);

  if (offers.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        {t("notFound")}
      </div>
    );
  }

  return (
    <>
      {offers.map((offer, index) => (
        <div key={offer.documentId} className="bg-card rounded-lg border p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
              {index + 1}
            </span>
            <div className="from-primary h-px flex-1 bg-gradient-to-r to-transparent" />
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-3xl font-semibold">{offer.title}</h2>
            {offer.description && (
              <p className="text-muted-foreground">{offer.description}</p>
            )}
          </div>

          {offer.offerSections && offer.offerSections.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
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
    </>
  );
}

export default function OfferContent() {
  const t = useTranslations("Offer");

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <PageTitle title={t("title")} />
      <OfferList />
    </div>
  );
}
