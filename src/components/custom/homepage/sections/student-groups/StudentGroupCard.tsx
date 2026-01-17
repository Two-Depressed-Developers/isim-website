import { ComponentHomepageGroupItem } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CardAsLinkWrapper from "@/components/custom/CardAsLinkWrapper";

type Props = {
  group: ComponentHomepageGroupItem;
  preloadImg: boolean;
};

export default function StudentGroupCard({ group, preloadImg }: Props) {
  return (
    <CardAsLinkWrapper
      link={group.link}
      className="group hover:border-primary/50 relative flex flex-col gap-y-4 border border-gray-200 bg-white p-6 transition-all"
    >
      {group.image?.url && (
        <div className="border-gray-accent bg-second-background relative flex aspect-auto h-16 max-w-36 items-center justify-center border p-4">
          <StrapiImage
            imageLink={group.image.url}
            alt={group.image.alternativeText ?? group.name}
            width={160}
            height={80}
            preload={preloadImg}
            loading={!preloadImg ? "lazy" : "eager"}
            className="h-auto max-h-full w-full object-contain"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-md font-semibold">{group.name}</h3>
        <p className="text-muted-foreground line-clamp-4 text-sm">
          {group.description ?? ""}
        </p>
      </div>
    </CardAsLinkWrapper>
  );
}
