import { ScrapedDataItem } from "@/types";
import { BookOpen } from "lucide-react";
import Link from "next/link";

type Props = {
  item: ScrapedDataItem;
};

export default function ScrapedDataTile({ item }: Props) {
  const year = item.raw_data.year as string | undefined;
  const description = year
    ? `(${year}) ${item.description || item.authors}`
    : item.description || item.authors;

  const link = {
    URL: item.url,
    openInNewWindow: true,
  };

  return (
    <Link
      href={link.URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full cursor-pointer"
    >
      <div className="group bg-card hover:border-primary flex h-full items-center gap-4 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md">
        <div className="bg-muted text-muted-foreground flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="group-hover:text-primary text-foreground truncate font-semibold">
            {item.title}
          </h3>
          <p className="text-muted-foreground line-clamp-1 text-sm">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
