"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AppleCallbackPage() {
  const router = useRouter();
  const { loginWithApple } = useAuth();

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        // URL에서 Apple 로그인 결과 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (code) {
          // Apple 로그인 처리
          await loginWithApple(code);
          router.push("/"); // 메인 페이지로 리디렉트
        } else {
          throw new Error("Apple 로그인 코드를 받지 못했습니다.");
        }
      } catch (error) {
        console.error("Apple 콜백 처리 실패:", error);
        router.push("/?error=apple_login_failed");
      }
    };

    handleAppleCallback();
  }, [loginWithApple, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Apple 로그인 처리 중...</p>
      </div>
    </div>
  );
}
