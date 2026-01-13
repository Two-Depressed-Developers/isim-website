import { StrapiImage } from "./StrapiImage";
import CustomLink from "./CustomLink";
import { Separator } from "./ui/separator";
import { ContactLink } from "./ContactLink";
import type { MemberData } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  member: MemberData;
};

const MemberCard = ({ member }: Props) => {
  const t = useTranslations("Staff");

  return (
    <div className="group relative flex flex-col gap-1">
      <div className="relative grid grid-cols-[80px_1px_1fr] grid-rows-2 items-center gap-x-6 overflow-hidden rounded-2xl bg-white p-6 shadow-md">
        <CustomLink
          href={`/staff-members/${member.slug}`}
          isExternal={false}
          className="absolute inset-0 z-10"
          aria-label={`${t("viewProfileOf")} ${member.fullName}`}
        >
          <span className="sr-only">{t("viewProfile")}</span>
        </CustomLink>
        {member.photo?.url ? (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-xs">
            <StrapiImage
              imageLink={member.photo.url}
              className="h-full w-full object-cover"
              alt={member.photo.alternativeText || t("memberPhoto")}
              width={80}
              height={80}
            />
          </div>
        ) : (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-200"></div>
        )}
        <Separator
          orientation="vertical"
          className="bg-primary row-span-2 w-[3px] grid-flow-col-dense rounded-3xl"
        />
        <div>
          {member.title && (
            <h3 className="text-lg font-bold">{member.title}</h3>
          )}
          {member.fullName && (
            <p className="text-[32px] leading-[40px] font-semibold">
              {`${member.fullName || ""}`.trim()}
            </p>
          )}
        </div>
        <div />
        <div className="relative z-20 space-y-1">
          {member.phone && <ContactLink type="phone" value={member.phone} />}
          {member.email && <ContactLink type="mail" value={member.email} />}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
