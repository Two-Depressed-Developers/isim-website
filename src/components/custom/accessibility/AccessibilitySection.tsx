import IconWithBackground from "@/components/custom/IconWithBackground";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const AccessibilitySection = ({
  icon: Icon,
  title,
  children,
  gray = false,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  gray?: boolean;
}) => (
  <div
    className={cn(
      "border-gray-accent border-b py-16",
      gray ? "bg-second-background" : "bg-white",
    )}
  >
    <div className="mx-auto max-w-7xl space-y-8 px-4">
      <div className="flex items-center gap-4">
        <IconWithBackground
          icon={Icon}
          className={gray ? "bg-white" : undefined}
        />
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          {title}
        </h2>
      </div>
      <Separator className="bg-gray-accent" />
      <div className="prose max-w-none text-slate-900">{children}</div>
    </div>
  </div>
);
