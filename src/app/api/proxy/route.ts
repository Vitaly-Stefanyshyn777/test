import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE = process.env.UPSTREAM_BASE;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  
  console.log("🔀 [/api/proxy GET] → Запит:", {
    path: path ? decodeURIComponent(path) : null,
    hasUpstreamBase: !!UPSTREAM_BASE,
    cookies: {
      hasAdminJwt: !!req.cookies.get("bfb_admin_jwt")?.value,
      hasUserJwt: !!req.cookies.get("bfb_user_jwt")?.value,
    },
  });

  try {
    if (!UPSTREAM_BASE) {
      console.error("🔀 [/api/proxy GET] ❌ UPSTREAM_BASE не налаштовано");
      return NextResponse.json(
        { error: "Server configuration error: UPSTREAM_BASE is not set" },
        { status: 500 }
      );
    }

    if (!path) {
      console.error("🔀 [/api/proxy GET] ❌ Відсутній параметр path");
      return NextResponse.json(
        { error: "Missing path param" },
        { status: 400 }
      );
    }

    const targetUrl = `${UPSTREAM_BASE}${decodeURIComponent(path)}`;
    console.log("🔀 [/api/proxy GET] → Проксую до:", targetUrl);

    const headers: Record<string, string> = {};

    const auth =
      req.headers.get("authorization") || req.headers.get("Authorization");

    // Додаємо токен з httpOnly cookie, якщо є і якщо це не токен-ендпойнт
    const isJwtTokenEndpoint = decodeURIComponent(path).includes(
      "/wp-json/jwt-auth/v1/token"
    );
    const cookieToken = req.cookies.get("bfb_admin_jwt")?.value;
    const useAdminHeader =
      req.headers.get("x-internal-admin") === "1" ||
      req.headers.get("X-Internal-Admin") === "1";

    if (auth) {
      headers["Authorization"] = auth as string;
    } else if (!isJwtTokenEndpoint && useAdminHeader && cookieToken) {
      headers["Authorization"] = `Bearer ${cookieToken}`;
    } else if (!isJwtTokenEndpoint) {
      const userCookie = req.cookies.get("bfb_user_jwt")?.value;
      if (userCookie) {
        headers["Authorization"] = `Bearer ${userCookie}`;
      }
    }

    const upstreamRes = await fetch(targetUrl, {
      method: "GET",
      headers,
      // @ts-expect-error - duplex not in types for edge
      duplex: "half",
      cache: "no-store",
    });

    console.log("🔀 [/api/proxy GET] ← Отримано відповідь:", {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      contentType: upstreamRes.headers.get("content-type"),
    });

    const body = await upstreamRes.text();

    if (!upstreamRes.ok) {
      console.error("🔀 [/api/proxy GET] ❌ Помилка від WordPress:", {
        status: upstreamRes.status,
        body: body.substring(0, 500), // Перші 500 символів для діагностики
      });
    } else {
      console.log("🔀 [/api/proxy GET] ✅ Успішна відповідь");
    }

    return new NextResponse(body, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("🔀 [/api/proxy GET] ❌ Критична помилка:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Missing path param" },
        { status: 400 }
      );
    }

    const targetUrl = `${UPSTREAM_BASE}${decodeURIComponent(path)}`;
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const isJwtTokenEndpoint = decodeURIComponent(path).includes(
      "/wp-json/jwt-auth/v1/token"
    );

    const auth =
      req.headers.get("authorization") || req.headers.get("Authorization");
    const useAdminHeader =
      req.headers.get("x-internal-admin") === "1" ||
      req.headers.get("X-Internal-Admin") === "1";
    if (auth) {
      headers["Authorization"] = auth as string;
    } else if (!isJwtTokenEndpoint && useAdminHeader) {
      const cookieToken = req.cookies.get("bfb_admin_jwt")?.value;
      if (cookieToken) {
        headers["Authorization"] = `Bearer ${cookieToken}`;
      }
    } else if (!isJwtTokenEndpoint) {
      const userCookie = req.cookies.get("bfb_user_jwt")?.value;
      if (userCookie) {
        headers["Authorization"] = `Bearer ${userCookie}`;
      }
    }

    const upstreamRes = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseBody = await upstreamRes.text();

    return new NextResponse(responseBody, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Missing path param" },
        { status: 400 }
      );
    }

    const targetUrl = `${UPSTREAM_BASE}${decodeURIComponent(path)}`;
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const auth =
      req.headers.get("authorization") || req.headers.get("Authorization");
    const useAdminHeader =
      req.headers.get("x-internal-admin") === "1" ||
      req.headers.get("X-Internal-Admin") === "1";
    if (auth) {
      headers["Authorization"] = auth as string;
    } else if (useAdminHeader) {
      const cookieToken = req.cookies.get("bfb_admin_jwt")?.value;
      if (cookieToken) {
        headers["Authorization"] = `Bearer ${cookieToken}`;
      }
    } else {
      const userCookie = req.cookies.get("bfb_user_jwt")?.value;
      if (userCookie) {
        headers["Authorization"] = `Bearer ${userCookie}`;
      }
    }

    const upstreamRes = await fetch(targetUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseBody = await upstreamRes.text();

    return new NextResponse(responseBody, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);

  console.log("----- API DEBUG: PATCH /api/proxy -----");
  console.log("Client → Next API:");
  console.log("URL:", req.url);
  console.log("Body:", body);

  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Missing path param" },
        { status: 400 }
      );
    }

    const targetUrl = `${UPSTREAM_BASE}${decodeURIComponent(path)}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Додаємо Authorization так само, як у PUT/POST
    const auth =
      req.headers.get("authorization") || req.headers.get("Authorization");
    const useAdminHeader =
      req.headers.get("x-internal-admin") === "1" ||
      req.headers.get("X-Internal-Admin") === "1";

    if (auth) {
      headers["Authorization"] = auth as string;
    } else if (useAdminHeader) {
      const cookieToken = req.cookies.get("bfb_admin_jwt")?.value;
      if (cookieToken) {
        headers["Authorization"] = `Bearer ${cookieToken}`;
      }
    } else {
      const userCookie = req.cookies.get("bfb_user_jwt")?.value;
      if (userCookie) {
        headers["Authorization"] = `Bearer ${userCookie}`;
      }
    }

    const wpResponse = await fetch(targetUrl, {
      method: "PATCH",
      headers,
      body: body !== null ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const wpText = await wpResponse.text();

    console.log("Next API → WordPress:");
    console.log("Status:", wpResponse.status);
    console.log("Response:", wpText);

    return new NextResponse(wpText, {
      status: wpResponse.status,
      headers: {
        "content-type":
          wpResponse.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy PATCH error:", error);
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Missing path param" },
        { status: 400 }
      );
    }

    const targetUrl = `${UPSTREAM_BASE}${decodeURIComponent(path)}`;

    const headers: Record<string, string> = {};

    const upstreamRes = await fetch(targetUrl, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    const responseBody = await upstreamRes.text();

    return new NextResponse(responseBody, {
      status: upstreamRes.status,
      headers: {
        "content-type":
          upstreamRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
