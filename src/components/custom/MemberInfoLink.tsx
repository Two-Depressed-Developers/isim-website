export type InfoLinkTypes = "Email" | "Phone" | "Room";

type Props = {
  type: InfoLinkTypes;
  value: string;
  label?: string;
};

const MemberInfoLink = (props: Props) => {
  const getActionToRender = () => {
    switch (props.type) {
      case "Email":
        return <a href={`mailto:${props.value}`}>{props.value ?? "-"}</a>;
      case "Phone":
        return <a href={`tel:${props.value}`}>{props.value ?? "-"}</a>;
      default:
        return props.value;
    }
  };

  return (
    <div className="flex flex-row justify-between gap-x-2">
      <h4 className="font-medium">{props.label ?? props.type}:</h4>
      <p className="text-right">{getActionToRender()}</p>
    </div>
  );
};

export default MemberInfoLink;
