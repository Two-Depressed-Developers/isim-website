import { ComponentHomepageGroupItem } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import { ArrowUpRight } from "lucide-react";

type Props = {
  group: ComponentHomepageGroupItem;
  preloadImg: boolean;
};

export default function StudentGroupCard({ group, preloadImg }: Props) {
  const content = (
    <>
      {group.image?.url && (
        <div className="border-gray-accent bg-second-background relative flex aspect-auto h-16 max-w-36 items-center justify-center border p-4">
          <StrapiImage
            imageLink={group.image.url}
            alt={group.image.alternativeText || group.name}
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
    </>
  );

  const styles =
    "group relative flex flex-col gap-y-4 border border-gray-200 bg-white p-6 transition-all hover:border-primary/50";

  if (group.link?.URL) {
    return (
      <CustomLink
        href={group.link.URL}
        isExternal={group.link.isExternal ?? false}
        className={styles}
      >
        <ArrowUpRight className="group-hover:text-primary absolute top-4 right-4 h-5 w-5 text-gray-400 transition-colors" />

        {content}
      </CustomLink>
    );
  }

  return <div className={styles}>{content}</div>;
}
