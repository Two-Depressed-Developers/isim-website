import OfferSectionTile from "@/components/custom/offer/OfferSectionTile";
import { ResearchOffer } from "@/types";
import { Lightbulb } from "lucide-react";

type Props = {
  offer: ResearchOffer;
};

export default function ResearchOfferTile({ offer }: Props) {
  return (
    <div className="group border-l-primary/60 bg-card hover:from-primary/5 relative flex flex-col gap-4 rounded-md border border-l-4 p-4 transition hover:bg-gradient-to-r hover:to-transparent">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="group-hover:text-primary truncate font-semibold transition-colors">
            {offer.title}
          </h3>
          {offer.description && (
            <p className="text-muted-foreground line-clamp-1 text-sm">
              {offer.description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        {offer.offerSections
          ?.slice(0, 4)
          .map((section) => (
            <OfferSectionTile
              key={`section_${section.id}`}
              section={section}
              variant="compact"
            />
          ))}
      </div>
    </div>
  );
}
