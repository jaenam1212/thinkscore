import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, profile } = await request.json();

    console.log("카카오 로그인 API 호출 - 백엔드로 전달:", {
      kakaoId: profile.id,
      nickname: profile.nickname,
      email: profile.email,
    });

    // 백엔드 API 서버로 요청 전달
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/kakao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, profile }),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      return NextResponse.json(
        { error: "Backend request failed", details: error },
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("카카오 로그인 처리 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
