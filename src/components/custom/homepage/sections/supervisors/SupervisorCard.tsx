import { Member } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import { Separator } from "@/components/ui/separator";
import { ContactLink } from "@/components/ContactLink";
import { useTranslations } from "next-intl";

type Props = {
  member: Member;
  preloadImg: boolean;
};

export default function SupervisorCard({ member, preloadImg }: Props) {
  const t = useTranslations("HomePage.supervisor");

  return (
    <div className="group relative flex flex-col gap-1">
      <div className="relative grid grid-cols-[80px_1px_1fr] grid-rows-2 items-center gap-x-6 overflow-hidden rounded-2xl bg-white p-6 shadow-md">
        <CustomLink
          href={`/staff-members/${member.slug}`}
          isExternal={false}
          className="absolute inset-0 z-10"
          aria-label={`View profile of ${member.fullName}`}
        >
          <span className="sr-only">View profile</span>
        </CustomLink>

        {member.photo?.url ? (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-xs">
            <StrapiImage
              imageLink={member.photo.url}
              alt={member.photo.alternativeText || t("photoAlt")}
              width={80}
              height={80}
              preload={preloadImg}
              sizes="80px"
              loading={!preloadImg ? "lazy" : "eager"}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-200" />
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
              {member.fullName}
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
}
