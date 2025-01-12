import { Member } from "@/app/staff/types";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Earth } from "lucide-react";
import { StrapiImage } from "./StrapiImage";
import CustomLink from "./CustomLink";

interface MemberProps {
  member: Member;
}

const MemberCard = ({ member }: MemberProps) => {
  return (
    <div className="flex flex-row gap-6 rounded-lg border-2 border-gray-100 bg-white p-3 shadow-md transition-all hover:scale-105 hover:cursor-pointer hover:shadow-lg">
      {member.photo?.url && (
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
          <StrapiImage
            src={member.photo.url}
            className="h-full w-full object-cover"
            alt={member.photo.alternativeText || "Member photo"}
            width={80}
            height={80}
          />
        </div>
      )}

      <div className="flex flex-grow flex-col justify-start gap-y-1">
        <div>
          {member.title && (
            <h3 className="text-lg font-bold">{member.title}</h3>
          )}
          {(member.firstName || member.lastName) && (
            <p className="text-2xl font-bold">
              {`${member.firstName || ""} ${member.lastName || ""}`.trim()}
            </p>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-1">
          {member.phone && (
            <div className="flex items-center gap-2 text-gray-600 transition-all hover:text-gray-800">
              <Phone className="h-4 w-4" />
              <CustomLink
                href={`tel:${member.phone}`.replace(/\s/g, "")}
                isExternal={false}
                className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                {member.phone}
              </CustomLink>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2 text-gray-600 transition-all hover:text-gray-800">
              <Mail className="h-4 w-4" />
              <CustomLink
                href={`mailto:${member.email}`}
                isExternal={false}
                className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                {member.email}
              </CustomLink>
            </div>
          )}
        </div>

        <div className="mt-4 hidden gap-2 lg:flex">
          {member.USOSLink?.URL && (
            <Button
              asChild
              className="flex items-center gap-2 bg-gradient-to-r from-[#383556] to-[#444160] text-white hover:opacity-90"
            >
              <CustomLink
                href={member.USOSLink.URL}
                isExternal={member.USOSLink.isExternal}
              >
                <Earth className="h-2 w-2" />
                {member.USOSLink.text}
              </CustomLink>
            </Button>
          )}
          {member.BADAPLink?.URL && (
            <Button
              asChild
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <CustomLink
                href={member.USOSLink.URL}
                isExternal={member.USOSLink.isExternal}
              >
                <Earth className="h-2 w-2" />
                {member.BADAPLink.text}
              </CustomLink>
            </Button>
          )}
          {member.SKOSLink?.URL && (
            <Button
              asChild
              className="flex items-center gap-2 bg-[#00693c] text-white hover:bg-[#00532e]"
            >
              <CustomLink
                href={member.USOSLink.URL}
                isExternal={member.USOSLink.isExternal}
              >
                <Earth className="h-2 w-2" />
                {member.SKOSLink.text}
              </CustomLink>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
