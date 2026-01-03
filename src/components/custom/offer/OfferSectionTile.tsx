import { OfferSection } from "@/types/strapi";
import { Check, CheckCircle } from "lucide-react";

type Props = {
  section: OfferSection;
  variant?: "default" | "compact";
};

export default function OfferSectionTile({
  section,
  variant = "default",
}: Props) {
  if (variant === "compact") {
    return (
      <div className="bg-card flex items-center justify-center rounded-lg border p-2 text-center">
        <h3 className="text-sm font-semibold">{section.sectionTitle}</h3>
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
