import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const WhiteCard = ({ className, children }: Props) => {
  return (
    <div className={cn("border-gray-accent border bg-white p-6", className)}>
      {children}
    </div>
  );
};

export default WhiteCard;
