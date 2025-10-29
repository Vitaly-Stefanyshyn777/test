import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE =
  process.env.UPSTREAM_BASE || "https://www.api.bfb.projection-learn.website";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("faq_category");

    let url = `${UPSTREAM_BASE}/wp-json/wp/v2/faq`;
    if (categoryId) {
      url += `?faq_category=${categoryId}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[FAQ API] ❌ WordPress API error:",
        response.status,
        errorText
      );
      return NextResponse.json(
        { error: `WordPress API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[FAQ API] ❌ Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
