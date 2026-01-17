"use client";

import { useState, useEffect } from "react";
import OfferSectionTile from "@/components/custom/offer/OfferSectionTile";
import { ResearchOffer, OfferSection } from "@/types";
import { LucideIcon } from "lucide-react";

type Props = {
  offer: ResearchOffer;
  icons: LucideIcon[];
};

export default function ResearchOfferTile({ offer, icons }: Props) {
  const [randomSections, setRandomSections] = useState<OfferSection[]>([]);

  useEffect(() => {
    const shuffled = [...(offer.offerSections ?? [])]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    setRandomSections(shuffled);
  }, [offer.offerSections]);

  if (randomSections.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {randomSections.map((section, idx) => (
        <OfferSectionTile
          key={`${offer.id}_section_${section.id}`}
          section={section}
          variant="compact"
          icon={icons[idx % icons.length]}
        />
      ))}
    </div>
  );
}
