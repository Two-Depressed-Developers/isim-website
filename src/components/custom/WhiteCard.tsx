import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const WhiteCard = ({ className, children }: Props) => {
  return (
    <div className={cn("rounded-xl bg-white p-6 shadow-md", className)}>
      {children}
    </div>
  );
};

export default WhiteCard;
