import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.in.ua";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = `${UPSTREAM_BASE}/wp-json/wp/v2/product/${id}`;

    console.log("[WP Products API] 🔍 Запит для продукту:", url);

    const upstreamRes = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!upstreamRes.ok) {
      console.log("[WP Products API] ❌ Помилка:", upstreamRes.status);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const text = await upstreamRes.text();

    console.log("[WP Products API] ✅ Відповідь:", upstreamRes.status);

    return new NextResponse(text, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("/api/wp/products/[id] error", error);
    return NextResponse.json({ error: "wp product error" }, { status: 500 });
  }
}
