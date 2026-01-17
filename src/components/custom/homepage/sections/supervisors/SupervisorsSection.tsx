import { ComponentHomepageSupervisors } from "@/types";
import SectionHeader from "../../SectionHeader";
import SupervisorCard from "./SupervisorCard";

type Props = {
  data: ComponentHomepageSupervisors;
  preloadImg: boolean;
};

export default function SupervisorsSection({ data, preloadImg }: Props) {
  return (
    <section className="flex flex-col gap-y-8">
      <SectionHeader
        title={data.title}
        eyebrow={data.eyebrow}
        description={data.description}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {data.supervisors.map((supervisor) => (
          <SupervisorCard
            key={`member_${supervisor.id}`}
            supervisor={supervisor}
            preloadImg={preloadImg}
          />
        ))}
      </div>
    </section>
  );
}
