import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login", "/imprimir/"],
      },
    ],
    sitemap: "https://drakristhymoreno.com/sitemap.xml",
  };
}
