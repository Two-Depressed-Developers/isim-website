import { ComponentHomepageCollaborationItem } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import { ExternalLink } from "lucide-react";

type Props = {
  item: ComponentHomepageCollaborationItem;
  preloadImg: boolean;
};

export default function CollaborationItem({ item, preloadImg }: Props) {
  const content = (
    <div className="group relative flex h-32 w-full items-center justify-center rounded-xl bg-white p-4 shadow-md transition-transform hover:scale-105">
      <div className="relative h-full w-full">
        <StrapiImage
          src={item.logo.url}
          alt={item.logo.alternativeText || item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          objectFit="contain"
          preload={preloadImg}
          loading={!preloadImg ? "lazy" : "eager"}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex items-center justify-center gap-1.5 px-2 text-center text-sm font-semibold text-white">
          {item.name}
          {item.link?.URL && (
            <ExternalLink className="h-3.5 w-3.5 opacity-75" />
          )}
        </span>
      </div>
    </div>
  );

  if (item.link?.URL) {
    return (
      <CustomLink
        href={item.link.URL}
        isExternal={item.link.isExternal ?? true}
      >
        {content}
      </CustomLink>
    );
  }

  return content;
}
