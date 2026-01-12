import { SimpleSection } from "@/types";
import WhiteCard from "../WhiteCard";
import { Separator } from "@/components/ui/separator";
import { MarkdownRenderer } from "../MarkdownRenderer";

type Props = {
  sectionData?: SimpleSection;
};

const MemberSimpleSection = ({ sectionData }: Props) => {
  if (!sectionData) return null;

  return (
    <WhiteCard className="flex flex-col gap-y-4">
      <h2 className="text-3xl font-bold">{sectionData.title}</h2>
      <Separator />
      <div className="prose w-full max-w-none p-2">
        <MarkdownRenderer content={sectionData.text} />
      </div>
    </WhiteCard>
  );
};

export default MemberSimpleSection;
