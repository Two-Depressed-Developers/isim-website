
export enum InfoLinkTypes {
  Email = "Email",
  Phone = "Phone",
  Room = "Room",
}

interface MemberInfoLinkProps {
  type: InfoLinkTypes
  value: string;
}

const MemberInfoLink = (props : MemberInfoLinkProps) => {
  return (
    <div className="flex flex-row justify-between gap-x-2">
      <h4 className="font-medium">{props.type}:</h4>
      <p className="text-right">{props.value ?? "-"}</p>
    </div>
  )

}

export default MemberInfoLink;