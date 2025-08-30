import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    console.log(
      "카카오 콜백 API 호출됨, code:",
      code?.substring(0, 10) + "..."
    );

    if (!code) {
      console.error("인증 코드 없음");
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // 카카오 토큰 교환 API 호출
    const clientId =
      process.env.NEXT_PUBLIC_KAKAO_JS_KEY ||
      "2e88ef8df1d85ed606a1c6d423fcdd9a";
    const frontendUrl =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
    const redirectUri = `${frontendUrl}/auth/kakao/callback`;

    console.log("토큰 교환 파라미터:", {
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code?.substring(0, 10) + "...",
    });

    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("카카오 토큰 교환 실패:", {
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

    // 카카오 사용자 정보 조회
    const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error("카카오 사용자 정보 조회 실패");
      return NextResponse.json(
        { error: "Failed to get user info" },
        { status: 400 }
      );
    }

    const userData = await userResponse.json();

    const profile = {
      id: userData.id.toString(),
      nickname: userData.kakao_account?.profile?.nickname || "",
      email: userData.kakao_account?.email || "",
      profileImage: userData.kakao_account?.profile?.profile_image_url || "",
    };

    return NextResponse.json({
      accessToken,
      profile,
    });
  } catch (error) {
    console.error("카카오 콜백 처리 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
