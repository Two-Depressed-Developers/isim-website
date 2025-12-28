import { Conference, Journal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StrapiImage } from "@/components/StrapiImage";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { format, parseISO, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import CustomLink from "@/components/CustomLink";

type Props = {
  item: Conference | Journal;
  type: "conference" | "journal";
  variant?: "default" | "compact";
};

function isConference(item: Conference | Journal): item is Conference {
  return "startDate" in item;
}

function formatDateRange(startDate: string, endDate?: string) {
  const start = parseISO(startDate);

  if (!endDate || isSameDay(start, parseISO(endDate))) {
    return format(start, "d MMMM yyyy", { locale: pl });
  }

  const end = parseISO(endDate);
  return `${format(start, "d", { locale: pl })}-${format(end, "d MMMM yyyy", { locale: pl })}`;
}

export default function PublicationTile({
  item,
  type,
  variant = "default",
}: Props) {
  const isConf = isConference(item);
  const isRecurring = isConf && item.eventType === "Cykliczne";
  const isUpcoming = isConf && new Date(item.startDate) >= new Date();
  const link = isConf ? item.conferenceLink : item.journalLink;
  const image = isConf ? item.conferenceImage : item.coverImage;

  if (variant === "compact") {
    return (
      <Link
        href={`/${type === "conference" ? "conferences" : "journals"}/${item.documentId}`}
        className="group bg-card flex items-center gap-4 rounded-xl p-4 shadow-sm transition-all hover:shadow-md"
      >
        <div className="bg-muted text-muted-foreground flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg">
          {isConf ? (
            <>
              <span className="text-xs font-medium">
                {format(parseISO(item.startDate), "MMM", { locale: pl })}
              </span>
              <span className="text-lg leading-none font-bold">
                {format(parseISO(item.startDate), "d")}
              </span>
            </>
          ) : (
            <BookOpen className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="group-hover:text-primary text-foreground truncate font-semibold">
            {item.title}
          </h3>
          {isConf && (
            <p className="text-muted-foreground text-sm">
              {formatDateRange(item.startDate, item.endDate)}
            </p>
          )}
        </div>
        <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      {image?.url ? (
        <div className="relative h-48 overflow-hidden">
          <StrapiImage
            src={image.url}
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
                  Nadchodzące
                </Badge>
              )}
              {isRecurring && (
                <Badge
                  variant="secondary"
                  className="border-0 bg-white/20 text-white backdrop-blur-sm"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Cykliczne
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted relative h-32">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            {type === "journal" ? (
              <BookOpen className="h-20 w-20" />
            ) : (
              <CalendarDays className="h-20 w-20" />
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {isUpcoming && (
              <Badge className="bg-primary text-primary-foreground border-0">
                Nadchodzące
              </Badge>
            )}
            {isRecurring && (
              <Badge className="bg-secondary text-secondary-foreground border-0">
                <RefreshCw className="mr-1 h-3 w-3" />
                Cykliczne
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
              {formatDateRange(item.startDate, item.endDate)}
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
              {type === "journal" ? "Strona czasopisma" : "Strona wydarzenia"}
              <ExternalLink className="h-3.5 w-3.5" />
            </CustomLink>
          )}
        </div>
      </div>
    </div>
  );
}
