import CustomLink from "@/components/CustomLink";
import { Mail, MapPin, Phone, Pin } from "lucide-react";

type Props = {
  type: "phone" | "mail" | "room";
  value: string;
};

export default function SupervisorInfo({ type, value }: Props) {
  return (
    <div className="flex items-center gap-2 text-sm transition-all">
      {type === "mail" ? (
        <Mail className="h-4 w-4" />
      ) : type === "phone" ? (
        <Phone className="h-4 w-4" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}

      {type != "room" ? (
        <CustomLink
          href={
            type === "mail"
              ? `mailto:${value}`
              : `tel:${value}`.replace(/\s/g, "")
          }
          isExternal={false}
          className="hover:text-primary underline underline-offset-4 transition-colors"
        >
          {value}
        </CustomLink>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
