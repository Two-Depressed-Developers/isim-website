import { StrapiImage } from "./StrapiImage";
import CustomLink from "./CustomLink";
import { Separator } from "./ui/separator";
import { ContactLink } from "./ContactLink";

import type { MemberData } from "@/lib/types";

interface MemberProps {
  member: MemberData;
}

const MemberCard = ({ member }: MemberProps) => {
  return (
    <CustomLink
      href={`/staff-members/${member.slug}`}
      isExternal={false}
      className="flex flex-col gap-1"
    >
      <div className="grid grid-cols-[80px_1px_1fr] grid-rows-2 items-center gap-x-6 rounded-2xl bg-white p-6 shadow-md">
        {member.photo?.url ? (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full shadow-sm">
            <StrapiImage
              src={member.photo.url}
              className="h-full w-full object-cover"
              alt={member.photo.alternativeText || "Member photo"}
              width={80}
              height={80}
            />
          </div>
        ) : (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-200"></div>
        )}
        <Separator
          orientation="vertical"
          className="row-span-2 w-[3px] grid-flow-col-dense rounded-3xl bg-primary"
        />
        <div>
          {member.title && (
            <h3 className="text-lg font-bold">{member.title}</h3>
          )}
          {member.fullName && (
            <p className="text-[32px] font-semibold leading-[40px]">
              {`${member.fullName || ""}`.trim()}
            </p>
          )}
        </div>
        <div />
        <div className="space-y-1">
          {member.phone && <ContactLink type="phone" value={member.phone} />}
          {member.email && <ContactLink type="mail" value={member.email} />}
        </div>
      </div>
    </CustomLink>
  );
};

export default MemberCard;
