import { Conference, Journal } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { format, parseISO, isSameDay, Locale } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import CustomLink from "@/components/CustomLink";
import { useLocale, useTranslations } from "next-intl";
import CardAsLinkWrapper from "../CardAsLinkWrapper";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  variant?: "default" | "compact";
} & (
  | { type: "conference"; item: Conference }
  | { type: "journal"; item: Journal }
);

function formatDateRange(locale: Locale, startDate: string, endDate?: string) {
  const start = parseISO(startDate);

  if (!endDate || isSameDay(start, parseISO(endDate))) {
    return format(start, "d MMMM yyyy", { locale: locale });
  }

  const end = parseISO(endDate);
  return `${format(start, "d", { locale: locale })}-${format(end, "d MMMM yyyy", { locale: locale })}`;
}

export default function PublicationTile({
  item,
  type,
  variant = "default",
}: Props) {
  const t = useTranslations("Conferences");
  const currentLocale = useLocale();
  const dateFnsLocale = currentLocale === "pl" ? pl : enUS;

  const isConf = type === "conference";
  const isRecurring = isConf && item.eventType === "Cykliczne";
  const isUpcoming = isConf && new Date(item.startDate) >= new Date();
  const link = isConf ? item.conferenceLink : item.journalLink;
  const image = isConf ? item.conferenceImage : item.coverImage;

  if (variant === "compact") {
    return (
      <CardAsLinkWrapper
        link={link}
        className="hover:border-primary/50 flex items-center gap-4 p-6 transition-all"
      >
        <div className="bg-second-background text-primary border-gray-accent grid aspect-square min-w-16 place-content-center border p-2 text-center">
          {isConf ? (
            <>
              {image?.url ? (
                <StrapiImage
                  imageLink={image.url}
                  alt={item.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <CalendarDays size={32} />
              )}
            </>
          ) : (
            <BookOpen size={32} />
          )}
        </div>
        <div className="flex h-full min-w-0 flex-col justify-between gap-2">
          <h3 className="group-hover:text-primary truncate text-lg font-semibold">
            {item.title}
          </h3>
          {isConf ? (
            <p className="text-xs text-gray-500">
              {formatDateRange(dateFnsLocale, item.startDate, item.endDate)}
            </p>
          ) : (
            <p className="line-clamp-2 text-xs text-gray-500">
              {item.description ?? ""}
            </p>
          )}
        </div>
      </CardAsLinkWrapper>
    );
  }

  return (
    <Card className="hover:border-primary/50 group flex flex-col transition-all">
      <div className="relative h-64 w-full overflow-hidden">
        {image?.url ? (
          <StrapiImage
            imageLink={image.url}
            alt={item.title}
            width={600}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            {isConf ? (
              <CalendarDays className="text-muted-foreground h-20 w-20 opacity-20" />
            ) : (
              <BookOpen className="text-muted-foreground h-20 w-20 opacity-20" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="flex grow flex-col justify-between gap-y-6 p-6">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-lg font-bold">{item.title}</h3>

          {item.description && (
            <p className="line-clamp-3 text-sm text-gray-600">
              {item.description}
            </p>
          )}
        </div>

        {(isUpcoming || isRecurring) && (
          <div className="flex flex-wrap gap-2">
            {isUpcoming && (
              <Badge className="bg-primary text-primary-foreground border-0">
                {t("incoming")}
              </Badge>
            )}
            {isRecurring && (
              <Badge variant="outline">
                <RefreshCw className="mr-1 h-3 w-3" />
                {t("cyclic")}
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Separator className="bg-gray-accent" />

          <div className="flex justify-between">
            {isConf && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-sm text-gray-600">
                  {formatDateRange(dateFnsLocale, item.startDate, item.endDate)}
                </span>
              </div>
            )}

            {link && (
              <CustomLink
                href={link.URL}
                isExternal={link.isExternal}
                className="text-primary ml-auto flex items-center gap-x-1 text-sm font-semibold underline-offset-4 hover:underline"
              >
                {isConf ? t("eventSite") : t("journalSite")}
                <ArrowUpRight size={16} />
              </CustomLink>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
