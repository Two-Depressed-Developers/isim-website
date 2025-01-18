
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

  const getActionToRender = () => {
    switch (props.type) {
      case InfoLinkTypes.Email:
        return <a href={`mailto:${props.value}`}>{props.value ?? "-"}</a>;
      case InfoLinkTypes.Phone:
        return <a href={`tel:${props.value}`}>{props.value ?? "-"}</a>;
      default:
        return props.value;
    }
  }

  return (
    <div className="flex flex-row justify-between gap-x-2">
      <h4 className="font-medium">{props.type}:</h4>
      <p className="text-right">{getActionToRender()}</p>
    </div>
  )

}

export default MemberInfoLink;