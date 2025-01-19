import Member from "./Member";
import CustomLink from "./CustomLink";
import WhiteCard from "./custom/WhiteCard";

import { type Group as GroupType } from "@/lib/types";

interface GroupProps {
  group: GroupType;
}

const Group = (props: GroupProps) => {
  const { name, siteLink, members } = props.group;

  return (
    <WhiteCard className="flex flex-col gap-y-4">
      {props.group.siteLink ? (
        <CustomLink
          className="text-2xl font-bold underline"
          href={siteLink!.URL}
          isExternal={siteLink!.isExternal}
        >
          {siteLink!.text ?? name}
        </CustomLink>
      ) : (
        <h2 className="mb-2 text-2xl font-bold">{props.group.name}</h2>
      )}

      {members && members.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {members.map((member) => (
            <Member key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center">
          <p className="text-gray-500">No members in this group</p>
        </div>
      )}
    </WhiteCard>
  );
};

export default Group;
