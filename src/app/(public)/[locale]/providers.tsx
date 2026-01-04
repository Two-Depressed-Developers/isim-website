"use client";

import { NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
  locale: string;
};

export function LocaleProviders({ children, locale }: Props) {
  return (
    <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
  );
}
