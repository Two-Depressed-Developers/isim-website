import { MemberData, type Group as GroupType } from "@/types";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import CustomLink from "../../CustomLink";
import { MemberRow } from "../../MemberRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import SupervisorCard from "./MemberCard";

type Props = {
  group: GroupType;
  layout: "grid" | "details" | "list";
};

export default function MemberGroup(props: Props) {
  const { name, siteLink, members } = props.group;
  const t = useTranslations("Group");

  return (
    <div>
      {props.group.siteLink ? (
        <CustomLink
          href={siteLink?.URL || ""}
          isExternal={siteLink?.isExternal || true}
        >
          <TitleWithCount name={name} amount={members?.length || 0} />
        </CustomLink>
      ) : (
        <TitleWithCount name={name} amount={members?.length || 0} />
      )}

      {members && members.length > 0 ? (
        props.layout === "grid" ? (
          <GridLayout members={members} />
        ) : props.layout === "details" ? (
          <DetailsLayout members={members} />
        ) : (
          <ListLayout members={members} />
        )
      ) : (
        <div className="flex h-16 items-center justify-center">
          <p className="text-gray-500">{t("noMembers")}</p>
        </div>
      )}
    </div>
  );
}

const GridLayout = ({ members }: { members: MemberData[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {members.map((member) => (
        <SupervisorCard key={member.id} member={member} />
      ))}
    </div>
  );
};

const DetailsLayout = ({ members }: { members: MemberData[] }) => {
  const t = useTranslations("Group");
  return (
    <div className="border-gray-accent overflow-x-auto border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-24 font-semibold">{t("photo")}</TableHead>
            <TableHead className="w-32 font-semibold">{t("title")}</TableHead>
            <TableHead className="w-48 font-semibold">
              {t("fullName")}
            </TableHead>
            <TableHead className="w-96 font-semibold">{t("contact")}</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, i) => (
            <MemberRow key={i} member={member} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ListLayout = ({ members }: { members: MemberData[] }) => {
  return (
    <div className="divide-y divide-slate-200 border border-slate-200">
      {members.map((member) => (
        <Link
          key={member.id}
          href={`/staff-members/${member.slug}`}
          className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50"
        >
          <div className="flex items-center gap-4">
            <span className="group-hover:text-primary text-sm font-semibold text-slate-900 transition-colors">
              {member.fullName}
            </span>
            <span className="text-primary text-sm">{member.title}</span>
          </div>
          <ChevronRight className="group-hover:text-primary h-4 w-4 text-slate-400 transition-colors" />
        </Link>
      ))}
    </div>
  );
};

const TitleWithCount = ({ name, amount }: { name: string; amount: number }) => {
  return (
    <h2 className="mb-6 border-b border-slate-200 pb-3 text-lg font-medium text-slate-900">
      {name}
      <span className="ml-2 text-sm font-normal text-slate-400">
        ({amount})
      </span>
    </h2>
  );
};
