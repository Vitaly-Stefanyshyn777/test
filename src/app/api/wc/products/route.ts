import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.in.ua";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(`${UPSTREAM_BASE}/wp-json/wc/v3/products`);
    const incoming = new URL(req.url);
    incoming.searchParams.forEach((v, k) => {
      url.searchParams.set(k, v);
    });

    // Авторизація: пріоритет Bearer з заголовку або env, fallback Basic
    const incomingAuth = req.headers.get("authorization") || "";
    const jwtFromHeader = incomingAuth.startsWith("Bearer ")
      ? incomingAuth
      : req.headers.get("x-wp-jwt")
      ? `Bearer ${req.headers.get("x-wp-jwt")}`
      : "";
    // Read token from cookie if exists
    const jwtFromCookie = req.cookies.get("wp_jwt")?.value
      ? `Bearer ${req.cookies.get("wp_jwt")?.value}`
      : "";
    const jwtFromEnv = process.env.WP_JWT_TOKEN
      ? `Bearer ${process.env.WP_JWT_TOKEN}`
      : "";

    const basicUser = process.env.WC_CONSUMER_KEY;
    const basicPass = process.env.WC_CONSUMER_SECRET;

    let authHeader = "";
    // Використовуємо тільки Basic Auth
    if (basicUser && basicPass) {
      authHeader =
        "Basic " + Buffer.from(`${basicUser}:${basicPass}`).toString("base64");
      console.log("[Products API] 🔐 Використовується Basic Auth");
    } else {
      return NextResponse.json(
        { error: "Missing WC Basic Auth credentials" },
        { status: 500 }
      );
    }

    // Лог параметрів та URL
    console.log(
      "[WC products proxy] 🔎 Параметри:",
      Object.fromEntries(incoming.searchParams.entries())
    );
    console.log("[WC products proxy] 🔍 URL:", url.toString());

    const upstreamRes = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Authorization: authHeader },
    });
    const text = await upstreamRes.text();

    // Спробуємо зібрати короткий summary відповіді
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
        console.log("[WC products proxy] ✅ Відповідь (summary):", {
          count: data.length,
          sampleNames: names,
          uniqueCategorySlugs: categorySlugs,
        });
      }
    } catch (e) {
      console.log(
        "[WC products proxy] ⚠️ Не вдалося розпарсити JSON для логування"
      );
    }

    return new NextResponse(text, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("/api/wc/products error", error);
    return NextResponse.json({ error: "wc products error" }, { status: 500 });
  }
}
