import { OfferSection } from "@/types";
import { CheckCircle, LucideIcon } from "lucide-react";
import { useMemo } from "react";

type Props = {
  section: OfferSection;
  variant?: "default" | "compact";
  icon?: LucideIcon;
};

export default function OfferSectionTile({
  section,
  variant = "default",
  icon: Icon,
}: Props) {
  if (variant === "compact") {
    const displayFeatures = (section.features ?? []).slice(0, 3);

    return (
      <div className="group hover:border-primary/50 border-gray-accent flex gap-6 border bg-white p-6 transition-all">
        <div className="bg-second-background border-gray-accent flex aspect-square h-10 w-10 items-center justify-center border">
          {Icon ? <Icon className="text-primary h-6 w-6 shrink-0" /> : null}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold sm:line-clamp-1">
            {section.sectionTitle}
          </h3>
          <div className="text-xs text-gray-500">
            <ul className="space-y-2">
              {displayFeatures.map((feature) => (
                <li key={feature.id} className="flex items-start gap-2">
                  <span className="bg-primary my-auto h-1 w-1 shrink-0 rounded-full" />

                  <span className="line-clamp-1 flex-1">{feature.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card hover:border-primary/50 rounded-lg border p-6 transition-colors">
      <h3 className="mb-4 text-xl font-semibold">{section.sectionTitle}</h3>

      {section.features && section.features.length > 0 && (
        <ul className="space-y-3">
          {section.features.map((feature) => (
            <li key={feature.id} className="flex gap-2">
              <CheckCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{feature.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
