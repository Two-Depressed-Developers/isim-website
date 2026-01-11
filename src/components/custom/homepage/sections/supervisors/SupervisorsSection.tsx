import { ComponentHomepageSupervisors } from "@/types";
import SectionHeader from "../../SectionHeader";
import SupervisorCard from "./SupervisorCard";

type Props = {
  data: ComponentHomepageSupervisors;
  preloadImg: boolean;
};

export default function SupervisorsSection({ data, preloadImg }: Props) {
  return (
    <section className="flex flex-col gap-y-4">
      <SectionHeader
        title={data.title}
        description={data.description}
        className="mb-4"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {data.members?.map((member) => (
          <SupervisorCard
            key={`member_${member.id}`}
            member={member}
            preloadImg={preloadImg}
          />
        ))}
      </div>
    </section>
  );
}
