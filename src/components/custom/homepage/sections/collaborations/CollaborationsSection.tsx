import { ComponentHomepageCollaborations } from "@/types";
import SectionHeader from "../../SectionHeader";
import CollaborationItem from "./CollaborationItem";

type Props = {
  data: ComponentHomepageCollaborations;
  preloadImg: boolean;
};

export default function CollaborationsSection({ data, preloadImg }: Props) {
  return (
    <section className="flex flex-col gap-y-8">
      <SectionHeader
        title={data.title}
        description={data.description}
        eyebrow={data.eyebrow}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6 px-4">
        {data.items?.map((item, index) => (
          <div key={item.id || index} className="w-52 sm:w-60">
            <CollaborationItem
              item={item}
              preloadImg={preloadImg && index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
