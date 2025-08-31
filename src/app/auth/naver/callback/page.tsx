"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function NaverCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithNaver, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleNaverCallback = async () => {
      try {
        // URL에서 authorization code 추출
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        // state 검증 (CSRF 방지)
        const savedState = sessionStorage.getItem("naver_state");
        if (state !== savedState) {
          setError("보안 검증에 실패했습니다. 다시 시도해주세요.");
          setLoading(false);
          return;
        }
        sessionStorage.removeItem("naver_state"); // 사용 후 삭제

        if (errorParam) {
          setError("네이버 로그인이 취소되었습니다.");
          setLoading(false);
          return;
        }

        // 이미 로그인되어 있다면 홈으로 리다이렉트
        if (isAuthenticated) {
          console.log("이미 로그인 완료됨, 홈으로 이동");
          router.push("/");
          return;
        }

        if (!code) {
          setError("네이버 인증 코드가 없습니다.");
          setLoading(false);
          return;
        }

        // 코드가 이미 처리되었는지 확인 (중복 요청 방지)
        const processedCode = sessionStorage.getItem("naver_processed_code");
        if (processedCode === code) {
          console.log("이미 처리된 코드입니다, 홈으로 이동");
          router.push("/");
          return;
        }

        console.log("네이버 콜백 처리 시작:", {
          code: code?.substring(0, 10) + "...",
          state,
        });

        // REST API 방식: 백엔드에서 code로 토큰 교환 및 사용자 정보 가져오기
        const response = await fetch("/api/auth/naver/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("토큰 교환 API 에러:", errorData);
          throw new Error(
            errorData.details || errorData.error || "네이버 토큰 교환 실패"
          );
        }

        const data = await response.json();
        console.log("네이버 로그인 데이터:", data);

        // 로그인 성공 시 코드를 세션에 저장 (중복 처리 방지)
        sessionStorage.setItem("naver_processed_code", code);

        console.log("loginWithNaver 호출 시작");
        await loginWithNaver(data.accessToken, data.profile);
        console.log("loginWithNaver 성공, 홈으로 이동");
        router.push("/");
      } catch (error) {
        console.error("네이버 콜백 처리 실패:", error);
        // 에러가 발생해도 로딩 상태를 유지 (사용자에게 실패를 보여주지 않음)
        // 대신 조용히 홈으로 리다이렉트
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    };

    // 즉시 실행 (SDK 로딩 대기 불필요)
    handleNaverCallback();
  }, [searchParams, loginWithNaver, router, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">네이버 로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  // 에러가 발생해도 로딩 화면을 계속 보여줌 (사용자에게 실패를 노출하지 않음)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">네이버 로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function NaverCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <NaverCallbackContent />
    </Suspense>
  );
}
