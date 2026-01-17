import OfferSectionTile from "@/components/custom/offer/OfferSectionTile";
import { ResearchOffer } from "@/types";
import { LucideIcon } from "lucide-react";

type Props = {
  offer: ResearchOffer;
  icons: LucideIcon[];
};

export default function ResearchOfferTile({ offer, icons }: Props) {
  const displaySections = (offer.offerSections ?? []).slice(0, 2);

  if (displaySections.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {displaySections.map((section, idx) => (
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
