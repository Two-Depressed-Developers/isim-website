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
    <div className="flex flex-row bg-white shadow-md rounded-lg p-3 gap-6 border-2 border-gray-100 hover:cursor-pointer hover:shadow-lg transition-all hover:scale-105">
      {member.photo?.url && (
        <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden">
          <StrapiImage 
            src={member.photo.url} 
            className="object-cover w-full h-full" 
            alt={member.photo.alternativeText || "Member photo"} 
            width={80} 
            height={80} 
          />  
        </div>
      )}

      <div className="flex flex-col justify-start flex-grow gap-y-1">
        <div>
          {member.title && <h3 className="text-lg font-bold">{member.title}</h3>}
          {(member.firstName || member.lastName) && (
            <p className="text-2xl font-bold">{`${member.firstName || ""} ${member.lastName || ""}`.trim()}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-2">
          {member.phone && (
            <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all">
              <Phone className="w-4 h-4" />
              <a
                href={`tel:${member.phone}`.replace(/\s/g, "")}
                className="underline underline-offset-4 decoration-dotted hover:decoration-solid"
              >
                {member.phone}
              </a>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all">
              <Mail className="w-4 h-4" />
              <a
                href={`mailto:${member.email}`}
                className="underline underline-offset-4 decoration-dotted hover:decoration-solid"
              >
                {member.email}
              </a>
            </div>
          )}
        </div>

        <div className="gap-2 mt-4 hidden lg:flex">
          {member.USOSLink?.URL && (
            <Button 
              asChild 
              className="flex items-center gap-2 text-white bg-gradient-to-r from-[#383556] to-[#444160] hover:opacity-90"
            >
              <a href={member.USOSLink.URL} target="_blank" rel="noopener noreferrer">
                <Earth className="w-2 h-2" />
                {member.USOSLink.text}
              </a>
            </Button>
          )}
          {member.BADAPLink?.URL && (
            <Button 
              asChild 
              className="flex items-center gap-2 text-white bg-black hover:bg-gray-800"
            >
              <a href={member.BADAPLink.URL} target="_blank" rel="noopener noreferrer">
                <Earth className="w-2 h-2" />
                {member.BADAPLink.text}
              </a>
            </Button>
          )}
          {member.SKOSLink?.URL && (
            <Button 
              asChild 
              className="flex items-center gap-2 text-white bg-[#00693c] hover:bg-[#00532e]"
            >
              <a href={member.SKOSLink.URL} target="_blank" rel="noopener noreferrer">
              <Earth className="w-2 h-2" /> 
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
