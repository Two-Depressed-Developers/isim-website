import { ComponentHomepageSupervisors, Member } from "@/lib/types";
import { StrapiImage } from "@/components/StrapiImage";
import CustomLink from "@/components/CustomLink";
import { Separator } from "@/components/ui/separator";
import { ContactLink } from "@/components/ContactLink";

type Props = {
  data: ComponentHomepageSupervisors;
};

function SupervisorCard({ member }: { member: Member }) {
  return (
    <CustomLink
      href={`/staff-members/${member.slug}`}
      isExternal={false}
      className="flex flex-col gap-1"
    >
      <div className="grid grid-cols-[80px_1px_1fr] grid-rows-2 items-center gap-x-6 rounded-2xl bg-white p-6 shadow-md">
        {member.photo?.url ? (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-xs">
            <StrapiImage
              src={member.photo.url}
              className="h-full w-full object-cover"
              alt={member.photo.alternativeText || "Zdjęcie opiekuna"}
              width={80}
              height={80}
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
        <div className="space-y-1">
          {member.phone && <ContactLink type="phone" value={member.phone} />}
          {member.email && <ContactLink type="mail" value={member.email} />}
        </div>
      </div>
    </CustomLink>
  );
}

export default function SupervisorsSection({ data }: Props) {
  return (
    <section className="flex flex-col gap-y-4">
      {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
      {data.description && (
        <p className="mb-8 text-gray-600">{data.description}</p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {data.members?.map((member) => (
          <SupervisorCard key={`member_${member.id}`} member={member} />
        ))}
      </div>
    </section>
  );
}
