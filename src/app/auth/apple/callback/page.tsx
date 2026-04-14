"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { buildAppReturnUrl } from "@/lib/platform";

function AppleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithApple } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        const errorParam = searchParams.get("error");
        const fromApp = searchParams.get("fromApp") === "1";
        const inAppCallback = searchParams.get("inAppCallback") === "1";
        const state = searchParams.get("state");
        const fromAppByState = Boolean(state?.startsWith("app_"));

        const idTokenFromQuery = searchParams.get("id_token");
        const idTokenFromHash = new URLSearchParams(
          window.location.hash.replace(/^#/, "")
        ).get("id_token");
        const idToken = idTokenFromQuery || idTokenFromHash;

        if (errorParam) {
          throw new Error("Apple 로그인이 취소되었습니다.");
        }

        const savedState = sessionStorage.getItem("apple_state");
        if (state && savedState && state !== savedState) {
          throw new Error("보안 검증에 실패했습니다. 다시 시도해주세요.");
        }
        sessionStorage.removeItem("apple_state");

        if ((fromApp || fromAppByState) && !inAppCallback) {
          const appRedirect = new URL(buildAppReturnUrl("apple"));
          const fullParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(
            window.location.hash.replace(/^#/, "")
          );

          hashParams.forEach((value, key) => fullParams.set(key, value));
          fullParams.set("fromApp", "1");
          fullParams.set("inAppCallback", "1");
          appRedirect.search = fullParams.toString();
          window.location.replace(appRedirect.toString());
          return;
        }

        if (idToken) {
          await loginWithApple(idToken);
          router.push("/");
          return;
        }

        throw new Error("Apple 로그인 토큰을 받지 못했습니다.");
      } catch (error) {
        console.error("Apple 콜백 처리 실패:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Apple 로그인 처리 중 오류가 발생했습니다.";
        setError(message);
        setTimeout(() => router.push("/?error=apple_login_failed"), 2000);
      }
    };

    handleAppleCallback();
  }, [loginWithApple, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>{error ?? "Apple 로그인 처리 중..."}</p>
      </div>
    </div>
  );
}

export default function AppleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Apple 로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <AppleCallbackContent />
    </Suspense>
  );
}
