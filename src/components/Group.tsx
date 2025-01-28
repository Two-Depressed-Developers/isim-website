import { Dot } from "lucide-react";

import MemberCard from "./MemberCard";
import CustomLink from "./CustomLink";

import { type Group as GroupType } from "@/lib/types";

interface GroupProps {
  group: GroupType;
}

const Group = (props: GroupProps) => {
  const { name, siteLink, members } = props.group;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-4xl leading-[48px] text-primary">
        <Dot />
        {props.group.siteLink ? (
          <CustomLink
            className="text-2xl font-bold underline"
            href={siteLink?.URL || ""}
            isExternal={siteLink?.isExternal || true}
          >
            <h2 className="mb-2 text-2xl font-bold">{name}</h2>
          </CustomLink>
        ) : (
          <h2 className="mb-2 text-2xl font-bold">{name}</h2>
        )}
      </div>

      {members && members.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center">
          <p className="text-gray-500">No members in this group</p>
        </div>
      )}
    </div>
  );
};

export default Group;
