"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        const savedState = sessionStorage.getItem("google_state");
        if (state && savedState && state !== savedState) {
          setError("보안 검증에 실패했습니다. 다시 시도해주세요.");
          setLoading(false);
          return;
        }
        sessionStorage.removeItem("google_state");

        if (errorParam) {
          setError("Google 로그인이 취소되었습니다.");
          setLoading(false);
          return;
        }

        if (isAuthenticated) {
          router.push("/");
          return;
        }

        if (!code) {
          setError("Google 인증 코드가 없습니다.");
          setLoading(false);
          return;
        }

        const processedCode = sessionStorage.getItem("google_processed_code");
        if (processedCode === code) {
          router.push("/");
          return;
        }

        const redirectUri =
          sessionStorage.getItem("google_redirect_uri") ||
          `${window.location.origin}/auth/google/callback`;

        const response = await fetch("/api/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, redirectUri }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || errorData.error || "Google 토큰 교환 실패"
          );
        }

        const data = await response.json();
        sessionStorage.setItem("google_processed_code", code);
        sessionStorage.removeItem("google_redirect_uri");

        await loginWithGoogle(data.accessToken, data.profile);
        router.push("/");
      } catch (err) {
        console.error("Google callback error:", err);
        const msg =
          err instanceof Error
            ? err.message
            : "로그인 처리 중 오류가 발생했습니다.";
        setError(msg);
        setTimeout(() => router.push("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, loginWithGoogle, router, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Google 로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">Google 로그인 실패</p>
          <p className="text-gray-600 text-sm break-words">{error}</p>
          <p className="text-gray-400 text-xs mt-4">
            3초 후 홈으로 이동합니다.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
