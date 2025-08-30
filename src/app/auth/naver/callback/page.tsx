"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// 전역 플래그로 중복 처리 방지
let isProcessingGlobal = false;

export default function NaverCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithNaver, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleNaverCallback = async () => {
      // 전역 플래그로 중복 처리 방지
      if (isProcessingGlobal) {
        console.log("이미 처리 중인 네이버 콜백이 있습니다.");
        return;
      }

      try {
        isProcessingGlobal = true;

        // URL에서 authorization code 추출
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

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

        await loginWithNaver(data.accessToken, data.profile);
        router.push("/");
      } catch (error) {
        console.error("네이버 콜백 처리 실패:", error);
        setError("로그인 처리 중 오류가 발생했습니다.");
        setLoading(false);
      } finally {
        isProcessingGlobal = false; // 처리 완료 후 플래그 리셋
      }
    };

    // 즉시 실행 (SDK 로딩 대기 불필요)
    handleNaverCallback();
  }, [searchParams, loginWithNaver, router, isAuthenticated]);

  // 쿠키에서 값 가져오기 (공식 문서 방식)
  function getCookie(name: string) {
    const parts = document.cookie.split(name + "=");
    if (parts.length === 2) {
      return parts[1].split(";")[0];
    }
    return null;
  }

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return null;
}
