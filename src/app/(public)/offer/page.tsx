"use client";

import OfferSectionTile from "@/components/custom/offer/OfferSectionTile";
import PageTitle from "@/components/PageTitle";
import { useResearchOffers } from "@/data/queries/use-research-offers";
import { Loader2 } from "lucide-react";
import { QueryWrapper } from "@/components/QueryWrapper";

function OfferList() {
  const { data: offers } = useResearchOffers();

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

export default function OfferPage() {
  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <PageTitle title="Nasza oferta" />
      <QueryWrapper
        loadingFallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        }
      >
        <OfferList />
      </QueryWrapper>
    </div>
  );
}
