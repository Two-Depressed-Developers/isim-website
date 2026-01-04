import BreadcrumbsDataLoader from "@/components/custom/breadcrumb/BreadcrumbsDataLoader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BreadcrumbsProvider } from "@/context/BreadcrumbsContext";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LocaleProviders } from "./providers";

export const revalidate = 3600; // 1 hour

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <LocaleProviders locale={locale} messages={messages}>
      <Header locale={locale} />
      <main className="flex grow flex-col">
        <BreadcrumbsProvider>
          <BreadcrumbsDataLoader locale={locale} />
          {children}
        </BreadcrumbsProvider>
      </main>
      <Footer locale={locale} />
    </LocaleProviders>
  );
}
