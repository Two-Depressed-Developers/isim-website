import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function IconWithBackground({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-second-background border-gray-accent text-primary grid aspect-square w-10 place-content-center border",
        className,
      )}
    >
      <Icon size={24} />
    </div>
  );
}
