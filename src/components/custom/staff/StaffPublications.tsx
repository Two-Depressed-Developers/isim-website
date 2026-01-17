"use client";

import type { DataProposal } from "@/types";
import { ExternalLink, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { StaffDetailsTile } from "./StaffDetailsTile";

type Props = {
  dataProposals: DataProposal[];
};

export default function StaffPublications({ dataProposals }: Props) {
  const t = useTranslations("Conferences");
  const tMember = useTranslations("MemberDetails");

  const publications = useMemo(() => {
    return dataProposals.flatMap((proposal) => {
      return proposal.scrapedData.filter((data) => data.status === "accepted");
    });
  }, [dataProposals]);

  if (publications.length === 0) {
    return null;
  }

  return (
    <StaffDetailsTile
      title={tMember("publicationsTitle")}
      icon={FileText}
      count={publications.length}
    >
      <div className="space-y-4 pt-4">
        {publications.map((pub, index) => (
          <div key={index} className="group">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="group-hover:text-primary text-sm font-medium text-slate-900 transition-colors">
                  {pub.title}
                </p>
                {!!pub.raw_data.year && (
                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-medium">
                      {String(pub.raw_data.year)}
                    </span>{" "}
                    · {pub.description}
                  </p>
                )}
              </div>
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary shrink-0 rounded-sm p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
                aria-label={t("viewPublication")}
              >
                <ExternalLink size="16" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </StaffDetailsTile>
  );
}
