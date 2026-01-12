"use client";

import dynamic from "next/dynamic";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ContactPageData } from "@/types/contact";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LeafletMap = dynamic(
  () => import("@/components/custom/contact/LeafletMap"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
  },
);

type Props = {
  data: ContactPageData;
};

export default function ContactContent({ data }: Props) {
  const t = useTranslations("Contact");

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-primary flex items-center gap-2 text-xl font-semibold">
              <MapPin className="h-5 w-5" />
              {t("addressHeader")}
            </h2>
          </CardHeader>

          <CardContent className="space-y-1 text-gray-700">
            <p className="font-medium">{data.departmentName}</p>
            <p>{data.facultyName}</p>
            <p>{data.universityName}</p>
            <div className="border-primary/20 mt-4 border-l-2 pl-4">
              <p>{data.streetAddress}</p>
              <p>{data.buildingInfo}</p>
              <p>{data.cityZip}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t("contactHeader")}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("phoneLabel")}</p>
                  <a
                    href={`tel:${data.phoneNumber}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {data.phoneNumber}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("emailLabel")}</p>
                  <a
                    href={`mailto:${data.email}`}
                    className="hover:text-primary font-medium"
                  >
                    {data.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Clock className="h-5 w-5 text-gray-500" />
                {t("hoursHeader")}
              </h2>
            </CardHeader>
            <CardContent className="prose-sm prose-gray">
              <ReactMarkdown>{data.openingHours}</ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="sticky top-24 space-y-4">
          <Card>
            <LeafletMap
              lat={data.latitude}
              lng={data.longitude}
              popupText={data.buildingInfo}
            />
          </Card>
          <p className="text-center text-sm text-gray-500">{t("mapCaption")}</p>
        </div>
      </div>
    </div>
  );
}
