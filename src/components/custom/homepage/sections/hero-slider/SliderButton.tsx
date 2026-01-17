import { Button } from "@/components/ui/button";

export default function SliderButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10 border border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </Button>
  );
}
