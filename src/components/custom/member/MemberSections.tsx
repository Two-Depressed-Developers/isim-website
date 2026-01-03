import { MemberSection, SimpleSection } from "@/types";
import MemberResearch from "./MemberResearch";
import MemberSimpleSection from "./MemberSimpleSection";

type Props = {
  memberSections?: MemberSection[];
};

function blockRenderer(block: MemberSection) {
  switch (block.__component) {
    case "members-comp.research":
      return <MemberResearch researchData={block} />;
    case "sections.simple-section":
      return <MemberSimpleSection sectionData={block as SimpleSection} />;
    default:
      return null;
  }
}

const MemberSections = ({ memberSections }: Props) => {
  if (!memberSections) return null;

  return (
    <div className="flex grow flex-col gap-y-4">
      {memberSections.map((section) => (
        <div key={section.id}>{blockRenderer(section)}</div>
      ))}
    </div>
  );
};

export default MemberSections;
