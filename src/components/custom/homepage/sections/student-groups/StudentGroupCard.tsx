import { ComponentHomepageGroupItem } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";

type Props = {
  group: ComponentHomepageGroupItem;
};

export default function StudentGroupCard({ group }: Props) {
  const content = (
    <div className="group flex h-full items-center gap-6 overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-transform hover:scale-[1.02]">
      {group.image?.url && (
        <div className="flex h-full w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-4 md:w-50">
          <StrapiImage
            src={group.image.url}
            alt={group.image.alternativeText || group.name}
            width={160}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-2xl font-bold">{group.name}</h3>
        {group.description && (
          <p className="line-clamp-4 text-gray-600">{group.description}</p>
        )}
      </div>
    </div>
  );

  if (group.link?.URL) {
    return (
      <CustomLink
        href={group.link.URL}
        isExternal={group.link.isExternal ?? false}
        className="h-full"
      >
        {content}
      </CustomLink>
    );
  }

  return content;
}
