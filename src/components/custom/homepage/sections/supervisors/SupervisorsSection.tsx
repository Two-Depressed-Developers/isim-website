import { ComponentHomepageSupervisors } from "@/types";
import SectionHeader from "../../SectionHeader";
import SupervisorCard from "./SupervisorCard";

type Props = {
  data: ComponentHomepageSupervisors;
  isPriorityImg: boolean;
};

export default function SupervisorsSection({ data, isPriorityImg }: Props) {
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
            isPriorityImg={isPriorityImg}
          />
        ))}
      </div>
    </section>
  );
}
