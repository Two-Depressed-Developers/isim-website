import { Dot } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import MemberCard from "./MemberCard";
import CustomLink from "./CustomLink";
import { MemberRow } from "./MemberRow";
import { ContactLink } from "./ContactLink";

import { MemberData, type Group as GroupType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GroupProps {
  group: GroupType;
  layout: "grid" | "details" | "list";
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
        props.layout === "grid" ? (
          <GridLayout members={members} />
        ) : props.layout === "details" ? (
          <DetailsLayout members={members} />
        ) : (
          <ListLayout members={members} />
        )
      ) : (
        <div className="flex h-16 items-center justify-center">
          <p className="text-gray-500">No members in this group</p>
        </div>
      )}
    </div>
  );
};

export default Group;

const GridLayout = ({ members }: { members: MemberData[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

const DetailsLayout = ({ members }: { members: MemberData[] }) => {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="overflow-hidden rounded-2xl bg-white hover:bg-white">
            <TableHead className="w-[100px] font-bold text-black">
              Photo
            </TableHead>
            <TableHead className="w-[250px] font-bold text-black">
              Title
            </TableHead>
            <TableHead className="font-bold text-black">Full name</TableHead>
            <TableHead className="font-bold text-black">Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, i) => (
            <MemberRow key={i} current={i} member={member} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ListLayout = ({ members }: { members: MemberData[] }) => {
  return (
    <div className="overflow-hidden rounded-2xl shadow-lg">
      <Table>
        <TableBody>
          {members.map((member, i) => (
            <TableRow
              key={i}
              className={cn("space-y-1 bg-white", {
                "bg-primary/5": i % 2 === 0,
              })}
            >
              <TableCell className="w-full py-2">
                <p className="text-lg font-bold">
                  {member.title} {member.fullName}
                </p>
                {member.phone && (
                  <ContactLink type="phone" value={member.phone} />
                )}
                {member.email && (
                  <ContactLink type="mail" value={member.email} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
