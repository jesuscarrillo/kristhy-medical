import { NextResponse } from "next/server";

const INDEXNOW_KEY = "c8aed97135bce70567f8bf38da8a6025";
const BASE_URL = "https://drakristhymoreno.com";

// URLs públicas del sitio
const PUBLIC_URLS = [
  BASE_URL,
  `${BASE_URL}/servicios`,
  `${BASE_URL}/sobre-mi`,
  `${BASE_URL}/contacto`,
  `${BASE_URL}/en`,
  `${BASE_URL}/en/servicios`,
  `${BASE_URL}/en/sobre-mi`,
  `${BASE_URL}/en/contacto`,
];

// POST /api/v1/indexnow
// Requiere: Authorization: Bearer {CRON_SECRET}
// Notifica a Bing, Yandex y Ecosia sobre las URLs del sitio
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = {
    host: "drakristhymoreno.com",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: PUBLIC_URLS,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "IndexNow submission failed", status: response.status },
      { status: 502 }
    );
  }

  return NextResponse.json({
    data: { submitted: PUBLIC_URLS.length, urls: PUBLIC_URLS },
    meta: { timestamp: new Date().toISOString() },
  });
}
