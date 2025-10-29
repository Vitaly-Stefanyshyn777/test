import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.projection-learn.website";

export async function GET(req: NextRequest) {
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

    if (process.env.NODE_ENV !== "production") {
      console.debug("[proxy.GET] →", {
        targetUrl,
        hasAuthHeader: !!headers["Authorization"],
        adminHeader:
          req.headers.get("x-internal-admin") === "1" ||
          req.headers.get("X-Internal-Admin") === "1",
      });
    }

    const upstreamRes = await fetch(targetUrl, {
      method: "GET",
      headers,
      // @ts-expect-error - duplex not in types for edge
      duplex: "half",
      cache: "no-store",
    });

    const body = await upstreamRes.text();

    if (process.env.NODE_ENV !== "production") {
      console.debug("[proxy.GET] ←", {
        status: upstreamRes.status,
        contentType: upstreamRes.headers.get("content-type"),
      });
    }

    return new NextResponse(body, {
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

    const upstreamRes = await fetch(targetUrl, {
      method: "PATCH",
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
