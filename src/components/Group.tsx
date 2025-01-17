import { type Group } from "@/lib/types";
import Member from "./Member";
import CustomLink from "./CustomLink";
import WhiteCard from "./custom/WhiteCard";

interface GroupProps {
  group: Group;
}

const Group = (props: GroupProps) => {
  const { name, siteLink } = props.group;

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

        {props.group.members.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {props.group.members.map((member) => <Member key={member.id} member={member} />)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-16">
            <p className="text-gray-500">No members in this group</p>
          </div>
        )}
    </WhiteCard>
  );
};

export default Group;
