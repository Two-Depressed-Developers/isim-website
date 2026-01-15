import { Member } from "@/types";
import { getTranslations } from "next-intl/server";

type Props = {
  member: Member;
  title: string;
};

export default async function ContactCard({ member, title }: Props) {
  const t = await getTranslations("MemberDetails");

  return (
    <div className="border-primary border-l-4 bg-gray-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-gray-900">{member.fullName}</p>
          {(member.title || member.position) && (
            <p className="text-sm text-gray-600">
              {member.title && member.title}{" "}
              {member.position && member.position}
            </p>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <div>
            <span className="font-medium text-gray-700">{t("email")}:</span>{" "}
            <a
              href={`mailto:${member.email}`}
              className="text-primary hover:underline"
            >
              {member.email}
            </a>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t("phone")}:</span>{" "}
            <a href={`tel:${member.phone}`} className="text-gray-900">
              {member.phone}
            </a>
          </div>
          {member.room && (
            <div>
              <span className="font-medium text-gray-700">{t("room")}:</span>{" "}
              <span className="whitespace-pre-wrap text-gray-900">
                {member.room}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
