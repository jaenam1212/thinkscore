"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import UserInfoModal from "@/components/auth/UserInfoModal";

interface KakaoCallbackProfile {
  id: string;
  nickname?: string;
  email: string;
  profileImage?: string;
}

// 전역 플래그로 중복 처리 방지
let isProcessingGlobal = false;

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithKakao, isAuthenticated, updateUserInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [kakaoProfile, setKakaoProfile] = useState<KakaoCallbackProfile | null>(
    null
  );

  useEffect(() => {
    const handleKakaoCallback = async () => {
      // 전역 플래그로 중복 처리 방지
      if (isProcessingGlobal) {
        console.log("이미 처리 중인 카카오 콜백이 있습니다.");
        return;
      }

      try {
        isProcessingGlobal = true;

        // URL에서 authorization code 추출
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setError("카카오 로그인이 취소되었습니다.");
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
          setError("카카오 인증 코드가 없습니다.");
          setLoading(false);
          return;
        }

        // 코드가 이미 처리되었는지 확인 (중복 요청 방지)
        const processedCode = sessionStorage.getItem("kakao_processed_code");
        if (processedCode === code) {
          console.log("이미 처리된 코드입니다, 홈으로 이동");
          router.push("/");
          return;
        }

        console.log("카카오 콜백 처리 시작:", {
          code: code?.substring(0, 10) + "...",
          state,
        });

        // REST API 방식: 백엔드에서 code로 토큰 교환 및 사용자 정보 가져오기
        const response = await fetch("/api/auth/kakao/callback", {
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
            errorData.details || errorData.error || "카카오 토큰 교환 실패"
          );
        }

        const data = await response.json();
        console.log("카카오 로그인 데이터:", data);

        // 로그인 성공 시 코드를 세션에 저장 (중복 처리 방지)
        sessionStorage.setItem("kakao_processed_code", code);

        // 먼저 백엔드에서 카카오 로그인 시도
        const backendResponse = await fetch("/api/auth/kakao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: data.accessToken,
            profile: data.profile,
          }),
        });

        if (!backendResponse.ok) {
          throw new Error("Backend kakao login failed");
        }

        const backendData = await backendResponse.json();

        // 추가 정보가 필요한 경우
        if (backendData.requiresAdditionalInfo) {
          sessionStorage.setItem("kakao_temp_token", data.accessToken);
          setKakaoProfile(backendData.profile);
          setShowUserInfoModal(true);
          setLoading(false);
        } else {
          // 로그인 완료
          await loginWithKakao(data.accessToken, data.profile);
          router.push("/");
        }
      } catch (error) {
        console.error("카카오 콜백 처리 실패:", error);
        setError("로그인 처리 중 오류가 발생했습니다.");
        setLoading(false);
      } finally {
        isProcessingGlobal = false; // 처리 완료 후 플래그 리셋
      }
    };

    // 즉시 실행 (SDK 로딩 대기 불필요)
    handleKakaoCallback();
  }, [searchParams, loginWithKakao, router, isAuthenticated]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">카카오 로그인 처리 중...</p>
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
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleUserInfoComplete = async (userInfo: {
    email: string;
    nickname: string;
  }) => {
    try {
      // 업데이트된 프로필로 직접 서버에 저장
      const updatedProfile = {
        ...kakaoProfile,
        email: userInfo.email,
        nickname: userInfo.nickname,
      };

      // 백엔드 API 서버에 업데이트된 정보 저장
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/kakao/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: sessionStorage.getItem("kakao_temp_token") || "",
            profile: updatedProfile,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save user info");
      }

      const userData = await response.json();

      // AuthContext의 사용자 상태 직접 업데이트
      if (userData.access_token && userData.user) {
        updateUserInfo(
          {
            id: userData.user.id,
            email: userData.user.email,
            displayName: userData.user.displayName,
          },
          userData.access_token
        );
      }

      setShowUserInfoModal(false);
      router.push("/");
    } catch (error) {
      console.error("사용자 정보 완료 처리 실패:", error);
      setError("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {showUserInfoModal && kakaoProfile && (
        <UserInfoModal
          isOpen={showUserInfoModal}
          onClose={() => {
            setShowUserInfoModal(false);
            router.push("/");
          }}
          onComplete={handleUserInfoComplete}
          kakaoProfile={kakaoProfile}
        />
      )}
    </>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
