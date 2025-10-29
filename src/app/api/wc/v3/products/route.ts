import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.projection-learn.website";
const WC_CONSUMER_KEY =
  process.env.WC_CONSUMER_KEY || "ck_fbd08d0a763d79d93aff6c3a56306214710ebb71";
const WC_CONSUMER_SECRET =
  process.env.WC_CONSUMER_SECRET ||
  "cs_871e6f287926ed84839018c2d7578ef9a71865c4";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(`${UPSTREAM_BASE}/wp-json/wc/v3/products`);
    const incoming = new URL(req.url);

    // Копіюємо всі параметри запиту
    incoming.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Додаємо авторизацію
    url.searchParams.set("consumer_key", WC_CONSUMER_KEY);
    url.searchParams.set("consumer_secret", WC_CONSUMER_SECRET);

    // Детальне логування запиту
    console.log("[WC v3 Products API] 🔍 Запит:", url.toString());
    console.log(
      "[WC v3 Products API] 🔎 Параметри:",
      Object.fromEntries(incoming.searchParams.entries())
    );

    const upstreamRes = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!upstreamRes.ok) {
      console.log("[WC v3 Products API] ❌ Помилка:", upstreamRes.status);
      const errorText = await upstreamRes.text();
      console.log("[WC v3 Products API] ❌ Помилка деталі:", errorText);
      return NextResponse.json(
        { error: "WC v3 products error" },
        { status: upstreamRes.status }
      );
    }

    const text = await upstreamRes.text();

    // Логування отриманих даних (не змінюючи відповідь)
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        const names = data.slice(0, 8).map((p) => p?.name);
        const categorySlugs = Array.from(
          new Set(
            data
              .flatMap((p) =>
                Array.isArray(p?.categories) ? p.categories : []
              )
              .map((c) => c?.slug)
              .filter(Boolean)
          )
        );
        console.log("[WC v3 Products API] ✅ Відповідь (summary):", {
          count: data.length,
          sampleNames: names,
          uniqueCategorySlugs: categorySlugs,
        });
      } else {
        console.log(
          "[WC v3 Products API] ⚠️ Очікував масив, отримано:",
          typeof data
        );
      }
    } catch (e) {
      console.log(
        "[WC v3 Products API] ⚠️ Не вдалося розпарсити JSON для логування"
      );
    }

    console.log("[WC v3 Products API] ✅ Відповідь:", upstreamRes.status);

    return new NextResponse(text, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("/api/wc/v3/products error", error);
    return NextResponse.json(
      { error: "wc v3 products error" },
      { status: 500 }
    );
  }
}
