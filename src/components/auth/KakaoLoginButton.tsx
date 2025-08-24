"use client";

import { useEffect, useState } from "react";
import { initializeKakao, kakaoLogin, KakaoProfile } from "@/lib/kakao";
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
  const [isSDKReady, setIsSDKReady] = useState(false);
  const { loginWithKakao } = useAuth();

  useEffect(() => {
    const setupKakao = async () => {
      try {
        const isReady = await initializeKakao();
        if (isReady) {
          setIsSDKReady(true);
        } else {
          console.error("카카오 SDK 초기화 실패");
        }
      } catch (error) {
        console.error("카카오 SDK 설정 중 에러:", error);
      }
    };

    setupKakao();
  }, []);

  const handleKakaoLogin = async () => {
    if (!isSDKReady || isLoading || disabled) return;

    setIsLoading(true);
    try {
      const { accessToken, profile } = await kakaoLogin();

      if (onSuccess) {
        onSuccess(profile, accessToken);
      } else {
        try {
          await loginWithKakao(accessToken, profile);
        } catch (loginError) {
          const error =
            loginError instanceof Error
              ? loginError
              : new Error("로그인 처리 중 오류가 발생했습니다");
          if (onError) {
            onError(error);
          } else {
            console.error("카카오 로그인 처리 실패:", error);
          }
        }
      }
    } catch (error) {
      const kakaoError =
        error instanceof Error ? error : new Error("카카오 로그인 실패");
      if (onError) {
        onError(kakaoError);
      } else {
        console.error("카카오 로그인 실패:", kakaoError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={!isSDKReady || isLoading || disabled}
      className={`flex items-center justify-center space-x-3 bg-yellow-400 rounded-lg px-4 py-3 text-gray-900 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
        />
      </svg>
      <span>
        {isLoading
          ? "로그인 중..."
          : !isSDKReady
            ? "로딩 중..."
            : "카카오로 로그인"}
      </span>
    </button>
  );
}
