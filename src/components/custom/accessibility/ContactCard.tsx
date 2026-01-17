import { Mail, Phone, DoorOpen } from "lucide-react";
import { Member } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  contact: Member;
  title: string;
  gray?: boolean;
};

export const ContactCard = ({ contact, title, gray }: Props) => (
  <div
    className={cn(
      `border-gray-accent border p-6`,
      gray ? "bg-second-background" : "bg-white",
    )}
  >
    <h3 className="mt-0 mb-4 text-lg font-semibold">{title}</h3>
    <div className="space-y-4">
      <div>
        <p className="!my-0 font-semibold text-slate-900">{contact.fullName}</p>
        {(contact.title || contact.position) && (
          <p className="!my-0 text-sm text-slate-500">
            {contact.title} {contact.position}
          </p>
        )}
      </div>
      <div className="space-y-2 text-sm">
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="text-primary" size={16} />
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline"
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-slate-900">
            <Phone className="text-primary" size={16} />
            <a
              href={`tel:${contact.phone}`}
              className="text-primary hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        )}
        {contact.room && (
          <div className="flex items-center gap-2 text-slate-900">
            <DoorOpen className="text-primary" size={16} />
            <span className="whitespace-pre-wrap">{contact.room}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
