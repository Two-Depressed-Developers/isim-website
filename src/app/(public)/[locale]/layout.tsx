import BreadcrumbsDataLoader from "@/components/custom/breadcrumb/BreadcrumbsDataLoader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BreadcrumbsProvider } from "@/context/BreadcrumbsContext";
import { routing } from "@/i18n/routing";
import { PublicEnvScript } from "@ryankshaw/next-runtime-env";
import { hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import "../../globals.css";
import { Providers } from "../../providers";
import { LocaleProviders } from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const revalidate = 3600; // 1 hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_URL || "https://isim.agh.edu.pl",
    ),
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    openGraph: {
      title: {
        default: t("defaultTitle"),
        template: t("titleTemplate"),
      },
      description: t("description"),
      type: "website",
      locale: locale,
      siteName: "ISiM",
      images: [{ url: "/images/logo.png", alt: "ISiM Logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: t("defaultTitle"),
        template: t("titleTemplate"),
      },
      description: t("description"),
      images: ["/images/logo.png"],
    },
  };
}

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
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={`bg-background flex min-h-screen flex-col font-sans antialiased`}
      >
        <Providers>
          <LocaleProviders locale={locale} messages={messages}>
            <Header />
            <main className="flex grow flex-col">
              <BreadcrumbsProvider>
                <BreadcrumbsDataLoader />
                {children}
              </BreadcrumbsProvider>
            </main>
            <Footer />
          </LocaleProviders>
        </Providers>
      </body>
    </html>
  );
}
