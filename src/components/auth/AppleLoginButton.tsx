"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AppleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI?: string;
          state?: string;
          usePopup?: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: {
            id_token: string;
            code: string;
            state?: string;
          };
          user?: {
            email?: string;
            name?: {
              firstName?: string;
              lastName?: string;
            };
          };
        }>;
      };
    };
  }
}

export default function AppleLoginButton({
  onSuccess,
  onError,
  disabled = false,
  className = "",
}: AppleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithApple } = useAuth();

  // Apple SDK 초기화
  React.useEffect(() => {
    if (window.AppleID && process.env.NEXT_PUBLIC_APPLE_CLIENT_ID) {
      window.AppleID.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });
    }
  }, []);

  const handleAppleLogin = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);

      if (!window.AppleID) {
        throw new Error("Apple Sign In SDK not loaded");
      }

      const response = await window.AppleID.auth.signIn();

      await loginWithApple(response.authorization.id_token, response.user);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const appleError =
        error instanceof Error ? error : new Error("Apple 로그인 실패");
      if (onError) {
        onError(appleError);
      } else {
        console.error("Apple 로그인 실패:", appleError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAppleLogin}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center space-x-3 bg-black text-white rounded-lg px-4 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span>{isLoading ? "로그인 중..." : "Apple로 로그인"}</span>
    </button>
  );
}
