import { ContactLink } from "./ContactLink";
import { StrapiImage } from "./StrapiImage";
import { TableCell, TableRow } from "./ui/table";
import { MemberData } from "@/types";
import { cn } from "@/lib/utils";

export const MemberRow = ({
  current,
  member,
}: {
  current: number;
  member: MemberData;
}) => {
  return (
    <TableRow
      key={member.id}
      className={cn("bg-white", { "bg-primary/5": current % 2 === 0 })}
    >
      <TableCell>
        {member.photo?.url ? (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full shadow-xs">
            <StrapiImage
              imageLink={member.photo.url}
              className="h-full w-full object-cover"
              alt={member.photo.alternativeText || "Member photo"}
              width={80}
              height={80}
            />
          </div>
        ) : (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-200"></div>
        )}
      </TableCell>
      <TableCell className="text-xl font-semibold">{member.title}</TableCell>
      <TableCell className="text-xl font-semibold">{member.fullName}</TableCell>
      <TableCell>
        <div className="space-y-1">
          {member.phone && <ContactLink type="phone" value={member.phone} />}
          {member.email && <ContactLink type="mail" value={member.email} />}
        </div>
      </TableCell>
    </TableRow>
  );
};
