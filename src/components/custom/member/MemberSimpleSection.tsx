import { SimpleSection } from "@/types/strapi";
import WhiteCard from "../WhiteCard";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MemberSimpleSectionsProps {
  sectionData?: SimpleSection;
}

const MemberSimpleSection = ({ sectionData }: MemberSimpleSectionsProps) => {
  if (!sectionData) return null;

  return (
    <WhiteCard className="flex flex-col gap-y-4">
      <h2 className="text-3xl font-bold">{sectionData.title}</h2>
      <Separator />
      <div className="prose w-full max-w-none p-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {sectionData.text}
        </ReactMarkdown>
      </div>
    </WhiteCard>
  );
};

export default MemberSimpleSection;
