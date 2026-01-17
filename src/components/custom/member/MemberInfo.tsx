import CustomLink from "@/components/CustomLink";
import { Mail, MapPin, Phone } from "lucide-react";

type Props = {
  type: "phone" | "mail" | "room";
  value: string;
};

export default function MemberInfo({ type, value }: Props) {
  const config = {
    mail: {
      Icon: Mail,
      href: `mailto:${value}`,
    },
    phone: {
      Icon: Phone,
      href: `tel:${value.replace(/\s/g, "")}`,
    },
    room: {
      Icon: MapPin,
      href: null,
    },
  };

  const { Icon, href } = config[type];

  return (
    <div className="z-1000 flex items-center gap-2 text-sm transition-all">
      <Icon className="h-4 w-4 shrink-0" />

      {href ? (
        <CustomLink
          href={href}
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
