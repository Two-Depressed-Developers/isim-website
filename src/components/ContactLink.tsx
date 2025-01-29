import { Mail, Phone } from "lucide-react";
import CustomLink from "./CustomLink";

export const ContactLink = (props: {
  type: "mail" | "phone";
  value: string;
}) => {
  return (
    <div className="flex items-center gap-2 text-light-gray-text transition-all">
      {props.type === "mail" ? (
        <Mail className="h-4 w-4" />
      ) : (
        <Phone className="h-4 w-4" />
      )}

      <CustomLink
        href={
          props.type === "mail"
            ? `mailto:${props.value}`
            : `tel:${props.value}`.replace(/\s/g, "")
        }
        onClick={(e) => e.stopPropagation()}
        isExternal={false}
        className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
      >
        {props.value}
      </CustomLink>
    </div>
  );
};
