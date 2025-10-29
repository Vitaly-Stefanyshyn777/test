import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.projection-learn.website";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const incomingAuthHeader = request.headers.get("authorization") || "";
    const jwtFromHeader = incomingAuthHeader.startsWith("Bearer ")
      ? incomingAuthHeader.substring("Bearer ".length)
      : request.headers.get("x-wp-jwt") || "";
    const jwtFromCookie = request.cookies.get("bfb_user_jwt")?.value || "";
    const adminCookie = request.cookies.get("bfb_admin_jwt")?.value || "";
    const jwtFromEnv = process.env.WP_JWT_TOKEN || "";

    const wpUser = process.env.WP_BASIC_USER || process.env.ADMIN_USER;
    const wpPass = process.env.WP_BASIC_PASS || process.env.ADMIN_PASS;

    if (!wpUser || !wpPass) {
      console.error("[Trainers API] ❌ WP креденшалі не налаштовані");
      return NextResponse.json(
        { error: "WordPress credentials not configured" },
        { status: 500 }
      );
    }

    const url = new URL(`${UPSTREAM_BASE}/wp-json/wp/v2/users`);

    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    if (!url.searchParams.has("per_page")) {
      url.searchParams.set("per_page", "100");
    }

    if (!url.searchParams.has("roles")) {
      url.searchParams.set("roles", "bfb_coach");
    }

    const wantsAdmin =
      request.headers.get("x-internal-admin") === "1" ||
      request.headers.get("X-Internal-Admin") === "1";

    let bearerToken =
      adminCookie || jwtFromHeader || jwtFromCookie || jwtFromEnv;

    let shouldSetAdminCookie = false;
    if (wantsAdmin && !bearerToken) {
      const upstreamBase =
        process.env.UPSTREAM_BASE ||
        "https://www.api.bfb.projection-learn.website";
      const username = process.env.ADMIN_USER;
      const password = process.env.ADMIN_PASS;
      if (username && password && upstreamBase) {
        try {
          const wpRes = await fetch(
            `${upstreamBase}/wp-json/jwt-auth/v1/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
              cache: "no-store",
            }
          );
          if (wpRes.ok) {
            const data = await wpRes.json();
            if (data?.token) {
              bearerToken = data.token as string;
              shouldSetAdminCookie = true;
            }
          }
        } catch {}
      }
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
      console.log(
        "[Trainers API] 🔐 Auth: Bearer JWT",
        wantsAdmin ? "(admin)" : "(user)"
      );
    } else if (wpUser && wpPass) {
      headers.Authorization = `Basic ${Buffer.from(
        `${wpUser}:${wpPass}`
      ).toString("base64")}`;
      console.log("[Trainers API] 🔐 Auth: Basic");
    }

    console.log("[Trainers API] 🚀 Запит до WordPress:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[Trainers API] ❌ Помилка WordPress API:",
        response.status,
        errorText
      );
      return NextResponse.json(
        { error: `WordPress API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[Trainers API] ✅ Отримано тренерів:", data.length);

    const res = NextResponse.json(data);
    if (shouldSetAdminCookie && bearerToken) {
      const isProd = process.env.NODE_ENV === "production";
      res.cookies.set("bfb_admin_jwt", bearerToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 60 * 60 * 12,
      });
    }
    return res;
  } catch (error) {
    console.error("[Trainers API] ❌ Помилка:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
