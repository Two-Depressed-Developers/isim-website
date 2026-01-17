import { SimpleLink } from "@/types";
import { PropsWithChildren } from "react";
import CustomLink from "../CustomLink";
import { ArrowUpRight } from "lucide-react";
import { Card } from "../ui/card";

type Props = {
  link?: SimpleLink;
  className?: string;
};

export default function CardAsLinkWrapper({
  link,
  className,
  children,
}: PropsWithChildren<Props>) {
  if (link?.URL) {
    return (
      <CustomLink
        href={link.URL}
        isExternal={link.isExternal ?? false}
        className={className}
      >
        <ArrowUpRight className="group-hover:text-primary absolute top-4 right-4 h-5 w-5 text-gray-400 transition-colors" />

        {children}
      </CustomLink>
    );
  }

  return <Card className={className}>{children}</Card>;
}
