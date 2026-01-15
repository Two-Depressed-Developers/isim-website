"use client";

import type { DataProposal } from "@/types";
import { useTranslations } from "next-intl";
import WhiteCard from "../WhiteCard";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import ScrapedDataTile from "./ScrapedDataTile";

type Props = {
  dataProposals: DataProposal[];
};

export default function MemberPublications({ dataProposals }: Props) {
  const t = useTranslations("Conferences");

  const publications = useMemo(() => {
    return dataProposals.flatMap((proposal) => {
      return proposal.scrapedData.filter((data) => data.status === "accepted");
    });
  }, [dataProposals]);

  if (publications.length === 0) {
    return null;
  }

  return (
    <WhiteCard className="flex flex-col gap-y-4">
      <h2 className="text-3xl font-bold">{t("title")}</h2>
      <Separator />

      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">{t("journals")}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {publications.map((item, index) => (
            <ScrapedDataTile key={`${index}`} item={item} />
          ))}
        </div>
      </div>
    </WhiteCard>
  );
}
