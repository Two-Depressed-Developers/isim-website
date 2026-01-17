import { ComponentHomepageStudentGroups } from "@/types";
import SectionHeader from "../../SectionHeader";
import StudentGroupCard from "./StudentGroupCard";

type Props = {
  data: ComponentHomepageStudentGroups;
  preloadImg: boolean;
};

export default function StudentGroupsSection({ data, preloadImg }: Props) {
  const groups = data.groups ?? [];
  const isOdd = groups.length % 2 === 1;

  return (
    <section className="flex flex-col gap-y-8">
      <SectionHeader title={data.title} eyebrow={data.eyebrow} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {groups.map((group, index) => {
          const isLastAndOdd = isOdd && index === groups.length - 1;
          return (
            <div
              key={`group_${group.id}`}
              className={isLastAndOdd ? "md:col-span-2" : ""}
            >
              <StudentGroupCard group={group} preloadImg={preloadImg} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
