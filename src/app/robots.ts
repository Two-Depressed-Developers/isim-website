import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel/", "/api/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL || "https://isim.agh.edu.pl"}/sitemap.xml`,
  };
}
