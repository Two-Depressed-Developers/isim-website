import { IGroup } from "@/app/staff/types";
import Member from "./Member";

interface GroupProps {
  group: IGroup;
}

const Group = (props: GroupProps) => {
  const members = [props.group.supervisor, ...props.group.members].filter(
    Boolean,
  );

  return (
    <div className="flex flex-col gap-y-4 rounded border border-gray-200 p-4">
      {props.group.siteLink ? (
        <a
          className="text-xl font-bold underline"
          href={props.group.siteLink.URL}
          target="_blank"
          rel="noreferrer"
        >
          {props.group.siteLink.text ?? props.group.name}
        </a>
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
