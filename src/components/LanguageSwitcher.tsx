"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || "pl";

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
        aria-label="Zmień język na polski"
      >
        🇵🇱
        <span className="sr-only">Polski</span>
      </Button>
      <Button
        variant={currentLocale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLocale("en")}
        className="h-7 px-3 text-xs"
        aria-label="Switch to English"
      >
        🇬🇧
        <span className="sr-only">English</span>
      </Button>
    </div>
  );
}
