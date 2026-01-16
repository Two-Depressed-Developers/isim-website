import { PublicEnvScript } from "@ryankshaw/next-runtime-env";
import { Metadata } from "next";
import { K2D } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";

const k2d = K2D({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL || "https://isim.agh.edu.pl",
  ),
  title: "ISiM - Panel Logowania",
  description: "Panel logowania do systemu ISiM",
  openGraph: {
    title: "ISiM - Panel Logowania",
    description: "Panel logowania do systemu ISiM",
    type: "website",
    locale: "pl",
    siteName: "ISiM",
    images: [{ url: "/images/logo.png", alt: "ISiM Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISiM - Panel Logowania",
    description: "Panel logowania do systemu ISiM",
    images: ["/images/logo.png"],
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={`${k2d.className} bg-background flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <main className="flex grow flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
