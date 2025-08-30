"use client";

import { useEffect, useState } from "react";
import { initializeKakao, kakaoLoginRedirect, KakaoProfile } from "@/lib/kakao";
import { useAuth } from "@/contexts/AuthContext";

interface KakaoLoginButtonProps {
  onSuccess?: (profile: KakaoProfile, accessToken: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

export default function KakaoLoginButton({
  onSuccess,
  onError,
  disabled = false,
  className = "",
}: KakaoLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(true); // 기본적으로 true (REST API 사용)
  const { loginWithKakao } = useAuth();

  useEffect(() => {
    // SDK 체크 없이 바로 REST API 사용
    console.log("카카오 로그인: REST API 방식 사용");
    setIsSDKReady(true);
  }, []);

  const handleKakaoLogin = () => {
    if (disabled) return;

    try {
      console.log("카카오 로그인 시작");
      // SDK 상태와 관계없이 REST API 방식 사용
      kakaoLoginRedirect();
    } catch (error) {
      const kakaoError =
        error instanceof Error ? error : new Error("카카오 로그인 실패");
      if (onError) {
        onError(kakaoError);
      } else {
        console.error("카카오 로그인 실패:", kakaoError);
      }
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={disabled}
      className={`flex items-center justify-center space-x-3 bg-yellow-400 rounded-lg px-4 py-3 text-gray-900 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
        />
      </svg>
      <span>{"카카오로 로그인"}</span>
    </button>
  );
}
