import { NextResponse, NextRequest } from "next/server";

const UPSTREAM_BASE = process.env.UPSTREAM_BASE;

// Обробка OPTIONS для CORS
export async function OPTIONS(_req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET() {
  console.log("🎨 [/api/banners] → Запит на отримання банерів");

  try {
    if (!UPSTREAM_BASE) {
      console.error("🎨 [/api/banners] ❌ UPSTREAM_BASE не налаштовано");
      return NextResponse.json(
        { error: "UPSTREAM_BASE is not configured" },
        { status: 500 }
      );
    }

    const normalize = (v?: string) => (v || "").replace(/^['"]|['"]$/g, "");
    const username = normalize(process.env.ADMIN_USER);
    const password = normalize(process.env.ADMIN_PASS);

    console.log("🎨 [/api/banners] → Креденшали:", {
      hasUsername: !!username,
      hasPassword: !!password,
      upstreamBase: UPSTREAM_BASE,
    });

    let freshToken: string | undefined;
    if (username && password) {
      console.log("🎨 [/api/banners] → Отримую JWT токен для адміна");
      const tokenRes = await fetch(
        `${UPSTREAM_BASE}/wp-json/jwt-auth/v1/token`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "User-Agent": "BFB-NextJS-App",
            "Accept": "application/json",
          },
          body: JSON.stringify({ username, password }),
          cache: "no-store",
        }
      );

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        freshToken = tokenData?.token;
        console.log("🎨 [/api/banners] ✅ JWT токен отримано");
      } else {
        console.error("🎨 [/api/banners] ❌ Не вдалося отримати JWT токен:", {
          status: tokenRes.status,
          statusText: tokenRes.statusText,
        });
      }
    }

    const targetUrl = new URL(`${UPSTREAM_BASE}/wp-json/wp/v2/banner`);
    targetUrl.searchParams.set("_", Date.now().toString());

    console.log("🎨 [/api/banners] → Запит до WordPress:", targetUrl.toString());

    const headers: Record<string, string> = {
      "User-Agent": "BFB-NextJS-App",
      "Accept": "application/json",
    };

    if (freshToken) {
      headers["Authorization"] = `Bearer ${freshToken}`;
      console.log("🎨 [/api/banners] → Використовую JWT токен для запиту");
    }

    const upstreamRes = await fetch(targetUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log("🎨 [/api/banners] → Отримано відповідь від WordPress:", {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
    });

    if (!upstreamRes.ok) {
      const errorText = await upstreamRes.text();
      console.error("🎨 [/api/banners] ❌ Помилка від WordPress:", {
        status: upstreamRes.status,
        errorText,
      });
      return NextResponse.json(
        { error: `Request failed ${upstreamRes.status}`, details: errorText },
        { status: upstreamRes.status }
      );
    }

    const data = await upstreamRes.json();
    console.log("🎨 [/api/banners] ✅ Отримано банерів:", Array.isArray(data) ? data.length : "не масив");

    const response = NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });

    if (freshToken) {
      const isProd = process.env.NODE_ENV === "production";
      response.cookies.set("bfb_admin_jwt", freshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      console.log("🎨 [/api/banners] → JWT токен збережено в cookie");
    }

    return response;
  } catch (error) {
    console.error("🎨 [/api/banners] ❌ Критична помилка:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch banners",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
