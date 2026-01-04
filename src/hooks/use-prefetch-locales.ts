import { routing } from "@/i18n/routing";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export function usePrefetchLocales<T>(
  queryKeyFactory: (locale: string) => QueryKey,
  queryFnFactory: (locale: string) => Promise<T>,
) {
  const locale = useLocale();
  const queryClient = useQueryClient();

  useEffect(() => {
    routing.locales.forEach((otherLocale) => {
      if (otherLocale !== locale) {
        queryClient.prefetchQuery({
          queryKey: queryKeyFactory(otherLocale),
          queryFn: () => queryFnFactory(otherLocale),
        });
      }
    });
  }, [locale, queryClient, queryKeyFactory, queryFnFactory]);
}
