import { type Group } from "@/app/staff/types";
import Member from "./Member";
import CustomLink from "./CustomLink";

interface GroupProps {
  group: Group;
}

const Group = (props: GroupProps) => {
  const { name, siteLink } = props.group;
  const members = [props.group.supervisor, ...props.group.members].filter(
    Boolean,
  );

  return (
    <div className="flex flex-col gap-y-4 rounded border border-gray-200 p-4">
      {props.group.siteLink ? (
        <CustomLink
          className="text-xl font-bold underline"
          href={siteLink.URL}
          isExternal={siteLink.isExternal}
        >
          {siteLink.text ?? name}
        </CustomLink>
      ) : (
        <h2 className="mb-2 text-xl font-bold">{props.group.name}</h2>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {members.length > 0 &&
          members.map((member) => <Member key={member.id} member={member} />)}
      </div>
    </div>
  );
};

export default Group;
