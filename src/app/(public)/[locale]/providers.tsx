"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
};

export function LocaleProviders({
  children,
  locale,
  messages,
  timeZone = "Europe/Warsaw",
}: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
