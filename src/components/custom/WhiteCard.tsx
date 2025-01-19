import { cn } from "@/lib/utils";

interface WhiteCardProps {
  className?: string;
  children: React.ReactNode;
}

const WhiteCard = ({ className, children }: WhiteCardProps) => {
  return (
    <div className={cn("rounded-xl bg-white p-6 shadow-md", className)}>
      {children}
    </div>
  );
};

export default WhiteCard;
