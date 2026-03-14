import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri: clientRedirectUri } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    const clientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    const redirectUri =
      clientRedirectUri ||
      (process.env.NODE_ENV === "production"
        ? "https://www.thinkscore.kr/auth/google/callback"
        : "http://localhost:3000/auth/google/callback");

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Google client configuration missing" },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return NextResponse.json(
        {
          error: "Failed to exchange code for token",
          details: error,
        },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get user info" },
        { status: 400 }
      );
    }

    const userData = await userResponse.json();

    const profile = {
      id: userData.id,
      name: userData.name || userData.email?.split("@")[0] || "",
      email: userData.email || "",
      picture: userData.picture || "",
    };

    return NextResponse.json({
      accessToken,
      profile,
    });
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
