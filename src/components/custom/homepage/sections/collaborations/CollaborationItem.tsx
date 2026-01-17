import { ComponentHomepageCollaborationItem } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import { ArrowUpRight } from "lucide-react";

type Props = {
  item: ComponentHomepageCollaborationItem;
  preloadImg: boolean;
};

export default function CollaborationItem({ item, preloadImg }: Props) {
  const content = (
    <div className="group hover:border-primary/50 border-gray-accent relative aspect-2/1 w-full overflow-hidden border bg-white p-8 transition-all duration-300">
      <div className="relative h-full w-full">
        <StrapiImage
          imageLink={item.logo.url}
          alt={item.logo.alternativeText || item.name}
          fill
          sizes="(max-width: 640px) 140px, 180px"
          preload={preloadImg}
          loading={!preloadImg ? "lazy" : "eager"}
          className="object-contain transition-transform duration-500"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-3 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center gap-1 text-sm font-medium tracking-wider text-white">
          {item.name}
          {item.link?.URL && <ArrowUpRight className="size-4" />}
        </span>
      </div>
    </div>
  );

  if (item.link?.URL) {
    return (
      <CustomLink
        href={item.link.URL}
        isExternal={item.link.isExternal ?? true}
        className="block"
      >
        {content}
      </CustomLink>
    );
  }

  return content;
}
