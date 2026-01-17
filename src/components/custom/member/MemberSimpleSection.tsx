"use client";

import { SimpleSection } from "@/types";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { StaffDetailsTile } from "../staff/StaffDetailsTile";
import { FileText } from "lucide-react";

type Props = {
  sectionData?: SimpleSection;
};

const MemberSimpleSection = ({ sectionData }: Props) => {
  if (!sectionData) return null;

  return (
    <StaffDetailsTile
      title={sectionData.title}
      icon={FileText}
    >
      <div className="prose w-full max-w-none pt-4">
        <MarkdownRenderer content={sectionData.text} />
      </div>
    </StaffDetailsTile>
  );
};

export default MemberSimpleSection;
