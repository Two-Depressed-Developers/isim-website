import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="bg-muted flex h-full min-h-96 grow flex-col items-center justify-center gap-y-4 p-6 text-center">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>

      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-block rounded-md px-4 py-2 transition-colors"
      >
        {t("homeButton")}
      </Link>
    </div>
  );
}
