import { ArrowUpRight } from "lucide-react";
import { ContactLink } from "./ContactLink";
import { StrapiImage } from "./StrapiImage";
import { TableCell, TableRow } from "./ui/table";
import { MemberData } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const MemberRow = ({ member }: { member: MemberData }) => {
  const t = useTranslations("Group");

  return (
    <TableRow key={member.id} className="hover:bg-slate-50">
      <TableCell className="flex items-center">
        {member.photo?.url ? (
          <div className="h-10 w-10 shrink-0 overflow-hidden shadow-xs">
            <StrapiImage
              imageLink={member.photo.url}
              className="border-gray-accent h-full w-full border object-cover"
              alt={member.photo.alternativeText || t("memberPhotoAlt")}
              width={40}
              height={40}
            />
          </div>
        ) : (
          <div className="bg-gray-accent border-gray-accent h-10 w-10 shrink-0 overflow-hidden border"></div>
        )}
      </TableCell>
      <TableCell className="text-primary text-sm font-medium">
        {member.title}
      </TableCell>
      <TableCell className="hover:text-primary text-sm font-semibold text-slate-900 transition-colors">
        {member.fullName}
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-sm text-slate-600">
          {member.phone && <ContactLink type="phone" value={member.phone} />}
          {member.email && <ContactLink type="mail" value={member.email} />}
        </div>
      </TableCell>
      <TableCell>
        <Link
          href={`/staff-members/${member.slug}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0e759a]"
          aria-label={t("viewProfileOf", { name: member.fullName })}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
};
