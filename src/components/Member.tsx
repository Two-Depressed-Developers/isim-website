import { IMember } from "@/app/staff/types";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Earth } from "lucide-react";
import Image from "next/image";
import { StrapiImage } from "./StrapiImage";

interface MemberProps {
  member: IMember;
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
              <a
                href={`tel:${member.phone}`.replace(/\s/g, "")}
                className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                {member.phone}
              </a>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2 text-gray-600 transition-all hover:text-gray-800">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${member.email}`}
                className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                {member.email}
              </a>
            </div>
          )}
        </div>

        <div className="mt-4 hidden gap-2 lg:flex">
          {member.USOSLink?.URL && (
            <Button
              asChild
              className="flex items-center gap-2 bg-gradient-to-r from-[#383556] to-[#444160] text-white hover:opacity-90"
            >
              <a
                href={member.USOSLink.URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Earth className="h-2 w-2" />
                {member.USOSLink.text}
              </a>
            </Button>
          )}
          {member.BADAPLink?.URL && (
            <Button
              asChild
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <a
                href={member.BADAPLink.URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Earth className="h-2 w-2" />
                {member.BADAPLink.text}
              </a>
            </Button>
          )}
          {member.SKOSLink?.URL && (
            <Button
              asChild
              className="flex items-center gap-2 bg-[#00693c] text-white hover:bg-[#00532e]"
            >
              <a
                href={member.SKOSLink.URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Earth className="h-2 w-2" />
                {member.SKOSLink.text}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
