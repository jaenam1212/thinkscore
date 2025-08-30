import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    console.log(
      "네이버 콜백 API 호출됨, code:",
      code?.substring(0, 10) + "..."
    );

    if (!code) {
      console.error("인증 코드 없음");
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // 네이버 토큰 교환 API 호출
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    const redirectUri = "http://localhost:3000/auth/naver/callback";

    console.log("토큰 교환 파라미터:", {
      client_id: clientId,
      redirect_uri: redirectUri,
      has_client_secret: !!clientSecret,
      code: code?.substring(0, 10) + "...",
    });

    if (!clientId || !clientSecret) {
      console.error("네이버 클라이언트 정보 없음");
      return NextResponse.json(
        { error: "Naver client configuration missing" },
        { status: 500 }
      );
    }

    const tokenResponse = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("네이버 토큰 교환 실패:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: error,
      });
      return NextResponse.json(
        {
          error: "Failed to exchange code for token",
          details: error,
          status: tokenResponse.status,
        },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 네이버 사용자 정보 조회
    const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error("네이버 사용자 정보 조회 실패");
      return NextResponse.json(
        { error: "Failed to get user info" },
        { status: 400 }
      );
    }

    const userData = await userResponse.json();

    const profile = {
      id: userData.response.id,
      nickname: userData.response.nickname || "",
      email: userData.response.email || "",
      profile_image: userData.response.profile_image || "",
    };

    return NextResponse.json({
      accessToken,
      profile,
    });
  } catch (error) {
    console.error("네이버 콜백 처리 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
