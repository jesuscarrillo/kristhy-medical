import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://drakristhymoreno.com";
  const lastModified = new Date().toISOString().split("T")[0];

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          es: baseUrl,
          en: `${baseUrl}/en`,
          "x-default": baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/servicios`,
          en: `${baseUrl}/en/servicios`,
          "x-default": `${baseUrl}/servicios`,
        },
      },
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/sobre-mi`,
          en: `${baseUrl}/en/sobre-mi`,
          "x-default": `${baseUrl}/sobre-mi`,
        },
      },
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/contacto`,
          en: `${baseUrl}/en/contacto`,
          "x-default": `${baseUrl}/contacto`,
        },
      },
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          es: `${baseUrl}/privacidad`,
          en: `${baseUrl}/en/privacidad`,
          "x-default": `${baseUrl}/privacidad`,
        },
      },
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          es: `${baseUrl}/terminos`,
          en: `${baseUrl}/en/terminos`,
          "x-default": `${baseUrl}/terminos`,
        },
      },
    },
  ];
}
