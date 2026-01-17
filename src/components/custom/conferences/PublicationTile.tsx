import { Conference, Journal } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { format, parseISO, isSameDay, Locale } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import CustomLink from "@/components/CustomLink";
import { useLocale, useTranslations } from "next-intl";
import CardAsLinkWrapper from "../CardAsLinkWrapper";

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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      {image?.url ? (
        <div className="relative h-48 overflow-hidden">
          <StrapiImage
            imageLink={image.url}
            alt={item.title}
            width={600}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute right-4 bottom-4 left-4">
            <div className="flex items-center gap-2">
              {isUpcoming && (
                <Badge className="bg-primary text-primary-foreground border-0">
                  {t("incoming")}
                </Badge>
              )}
              {isRecurring && (
                <Badge
                  variant="secondary"
                  className="border-0 bg-white/20 text-white backdrop-blur-sm"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  {t("cyclic")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted relative h-32">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            {isConf ? (
              <CalendarDays className="h-20 w-20" />
            ) : (
              <BookOpen className="h-20 w-20" />
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {isUpcoming && (
              <Badge className="bg-primary text-primary-foreground border-0">
                {t("incoming")}
              </Badge>
            )}
            {isRecurring && (
              <Badge className="bg-secondary text-secondary-foreground border-0">
                <RefreshCw className="mr-1 h-3 w-3" />
                {t("cyclic")}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {isConf && (
          <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDateRange(dateFnsLocale, item.startDate, item.endDate)}
            </span>
          </div>
        )}

        <h3 className="group-hover:text-primary text-foreground mb-2 text-xl font-bold transition-colors">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-muted-foreground mb-4 flex-1">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex w-full items-center gap-2">
          {link && (
            <CustomLink
              href={link.URL}
              isExternal={link.isExternal}
              className="border-input bg-muted hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-3 rounded-md border px-4 py-1.5 text-center text-sm font-medium transition-colors"
            >
              {isConf ? t("eventSite") : t("journalSite")}
              <ExternalLink className="h-3.5 w-3.5" />
            </CustomLink>
          )}
        </div>
      </div>
    </div>
  );
}
