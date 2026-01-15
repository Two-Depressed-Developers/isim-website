"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || "pl";
  const t = useTranslations("Navigation");

  const switchLocale = (locale: string) => {
    router.push(pathname, { locale });
  };

  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={currentLocale === "pl" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLocale("pl")}
        className="h-7 px-3 text-xs"
        aria-label={t("changeLanguageToPolish")}
      >
        🇵🇱
        <span className="sr-only">{t("Polish")}</span>
      </Button>
      <Button
        variant={currentLocale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLocale("en")}
        className="h-7 px-3 text-xs"
        aria-label={t("changeLanguageToEnglish")}
      >
        🇬🇧
        <span className="sr-only">{t("English")}</span>
      </Button>
    </div>
  );
}
