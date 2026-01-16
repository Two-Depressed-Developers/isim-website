import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://isim.agh.edu.pl";
  const locales = ["pl", "en"];
  const staticPages = [
    "",
    "/accessibility",
    "/calendar",
    "/classrooms",
    "/conferences",
    "/contact",
    "/courses",
    "/helpdesk",
    "/offer",
    "/research-groups",
    "/staff",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
