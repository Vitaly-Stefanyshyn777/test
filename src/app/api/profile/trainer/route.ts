import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.projection-learn.website";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Prefer client-provided Authorization; fallback to WP_JWT_TOKEN
    let authHeader = req.headers.get("authorization") || "";
    if (!authHeader) {
      const jwt = process.env.WP_JWT_TOKEN;
      if (!jwt) {
        return NextResponse.json(
          {
            error:
              "Missing Authorization: provide Bearer token or set WP_JWT_TOKEN",
          },
          { status: 401 }
        );
      }
      authHeader = `Bearer ${jwt}`;
    }

    // Update current user (me) або конкретного користувача за id (якщо body.id передано)
    const targetId =
      typeof (body as Record<string, unknown>)?.id !== "undefined"
        ? String((body as Record<string, unknown>).id)
        : "me";
    const url = `${UPSTREAM_BASE}/wp-json/wp/v2/users/${targetId}`;

    const upstreamRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstreamRes.text();
    return new NextResponse(text, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("/api/profile/trainer PUT error", error);
    return NextResponse.json(
      { error: "trainer profile update error" },
      { status: 500 }
    );
  }
}
