import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function SectionContainer({ children, className }: Props) {
  return (
    <div className={cn("py-24", className)}>
      <div className="mx-auto max-w-7xl px-4">{children}</div>
    </div>
  );
}
