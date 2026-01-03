import { ComponentHomepageStudentGroups } from "@/types/strapi";
import SectionHeader from "../../SectionHeader";
import StudentGroupCard from "./StudentGroupCard";

type Props = {
  data: ComponentHomepageStudentGroups;
};

export default function StudentGroupsSection({ data }: Props) {
  const groups = data.groups ?? [];
  const isOdd = groups.length % 2 === 1;

  return (
    <section>
      <SectionHeader title={data.title} className="mb-8" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {groups.map((group, index) => {
          const isLastAndOdd = isOdd && index === groups.length - 1;
          return (
            <div
              key={`group_${group.id}`}
              className={isLastAndOdd ? "md:col-span-2" : ""}
            >
              <StudentGroupCard group={group} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
