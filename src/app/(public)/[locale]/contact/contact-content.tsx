"use client";

import IconWithBackground from "@/components/custom/IconWithBackground";
import { MarkdownRenderer } from "@/components/custom/MarkdownRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactPageData } from "@/types/contact";
import { Clock, Contact, MapPin, Navigation2 } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const contactData = {
  address: {
    icon: MapPin,
    title: "addressHeader",
  },
  contact: {
    icon: Contact,
    title: "contactHeader",
  },
  hours: {
    icon: Clock,
    title: "hoursHeader",
  },
  findUs: {
    icon: Navigation2,
    title: "findUsHeader",
  },
};

const LeafletMap = dynamic(
  () => import("@/components/custom/contact/LeafletMap"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  },
);

type Props = {
  data: ContactPageData;
};

export default function ContactContent({ data }: Props) {
  const t = useTranslations("Contact");

  return (
    <div className="grid gap-4 gap-x-8 lg:grid-cols-2">
      <div className="row-span-4 min-h-80">
        <LeafletMap
          lat={data.latitude}
          lng={data.longitude}
          popupText={data.buildingInfo}
        />
      </div>
      <ContactCard
        type="address"
        content={
          <div className="text-gray-text">
            <p className="font-medium">{data.departmentName}</p>
            <p>{data.facultyName}</p>
            <p className="mb-2">{data.universityName}</p>
            <p>{data.streetAddress}</p>
            <p>{data.buildingInfo}</p>
            <p>{data.cityZip}</p>
          </div>
        }
      />
      <ContactCard
        type="contact"
        content={
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("phoneLabel")}
              </p>
              <a
                href={`tel:${data.phoneNumber}`}
                className="hover:text-primary font-medium"
              >
                {data.phoneNumber}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("emailLabel")}
              </p>
              <a
                href={`mailto:${data.email}`}
                className="hover:text-primary font-medium"
              >
                {data.email}
              </a>
            </div>
          </div>
        }
      />
      <ContactCard
        type="hours"
        content={
          <div className="prose-sm prose-gray">
            <MarkdownRenderer content={data.openingHours} />
          </div>
        }
      />
      <ContactCard
        type="findUs"
        content={
          <div className="space-y-2 font-medium">
            <div>
              <p className="text-sm text-gray-500">{t("tramLabel")}</p>
              <p>{t("lines") + " " + data.tramLines}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("busLabel")}</p>
              <p>{t("lines") + " " + data.busLines}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("carLabel")}</p>
              <p>{t("parking")}</p>
            </div>
          </div>
        }
      />
    </div>
  );
}

const ContactCard = ({
  type,
  content,
}: {
  type: keyof typeof contactData;
  content: React.ReactNode;
}) => {
  const t = useTranslations("Contact");
  const data = contactData[type];

  return (
    <Card>
      <CardContent className="grid grid-cols-[64px_1fr] pt-6">
        <IconWithBackground className="row-span-full" icon={data.icon} />

        <div>
          <h2 className="text-lg font-semibold">{t(data.title)}</h2>
          {content}
        </div>
      </CardContent>
    </Card>
  );
};
