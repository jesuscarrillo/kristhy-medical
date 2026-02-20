import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://drakristhymoreno.com";

  return [
    {
      url: baseUrl,
      lastModified: "2026-02-20",
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: "2026-02-20",
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/servicios`,
          en: `${baseUrl}/en/servicios`,
        },
      },
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: "2026-02-20",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/sobre-mi`,
          en: `${baseUrl}/en/sobre-mi`,
        },
      },
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: "2026-02-20",
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/contacto`,
          en: `${baseUrl}/en/contacto`,
        },
      },
    },
  ];
}
