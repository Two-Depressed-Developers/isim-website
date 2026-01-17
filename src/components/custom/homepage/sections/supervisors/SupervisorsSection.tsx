import { ComponentHomepageSupervisors } from "@/types";
import SectionHeader from "../../SectionHeader";
import MemberCard from "../../../member/MemberCard";

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
        {data.supervisors?.map((supervisor) => (
          <MemberCard
            key={`member_${supervisor.id}`}
            member={supervisor.member}
            role={supervisor.role}
            preloadImg={preloadImg}
          />
        ))}
      </div>
    </section>
  );
}
