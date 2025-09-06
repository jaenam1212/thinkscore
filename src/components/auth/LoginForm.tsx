"use client";

import { useState } from "react";
import KakaoLoginButton from "./KakaoLoginButton";
import AppleLoginButton from "./AppleLoginButton";
import { KakaoProfile } from "@/lib/kakao";
import { useAuth } from "@/contexts/AuthContext";
import PrivacyModal from "./PrivacyModal";
import TermsModal from "./TermsModal";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
  isLoading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { loginWithKakao } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    await onLogin(email, password);
  };

  const handleKakaoSuccess = async (
    profile: KakaoProfile,
    accessToken: string
  ) => {
    try {
      await loginWithKakao(accessToken, profile);
      console.log("카카오 로그인 성공:", profile);
    } catch (error) {
      console.error("카카오 로그인 처리 실패:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleKakaoError = (error: Error) => {
    console.error("카카오 로그인 실패:", error);
    alert("카카오 로그인에 실패했습니다. 다시 시도해 주세요.");
  };

  const handleNaverLogin = () => {
    const clientId = "YLDgJDYDuWExTUVaH7b4";
    const redirectUri = encodeURIComponent(
      window.location.hostname === "localhost"
        ? "http://localhost:3000/auth/naver/callback"
        : "https://www.thinkscore.kr/auth/naver/callback"
    );
    const state = Math.random().toString(36).substring(2, 15);

    // state를 세션에 저장 (CSRF 방지)
    sessionStorage.setItem("naver_state", state);

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    window.location.href = naverAuthUrl;
  };

  const handleAppleSuccess = () => {
    console.log("Apple 로그인 성공!");
  };

  const handleAppleError = (error: Error) => {
    console.error("Apple 로그인 실패:", error);
    alert("Apple 로그인에 실패했습니다. 다시 시도해 주세요.");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
        <p className="text-gray-600 mt-2">계정에 로그인하세요</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-base"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-base"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim() || !password.trim()}
          className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 구분선 */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-4 text-sm text-gray-500">또는</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* 소셜 로그인 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={() => alert("Google 로그인 (준비 중)")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google로 시작하기</span>
        </button>

        <button
          onClick={handleNaverLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-100 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
          <span>네이버로 시작하기</span>
        </button>

        <KakaoLoginButton
          onSuccess={handleKakaoSuccess}
          onError={handleKakaoError}
          disabled={isLoading}
          className="w-full py-3 px-4"
        />

        <AppleLoginButton
          onSuccess={handleAppleSuccess}
          onError={handleAppleError}
          disabled={isLoading}
          className="w-full py-3 px-4"
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          계정이 없으신가요?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-slate-800 hover:text-slate-600 font-medium"
            disabled={isLoading}
          >
            회원가입
          </button>
        </p>
      </div>

      {/* 개인정보 처리방침 및 이용약관 */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          로그인 시{" "}
          <button
            onClick={() => setShowTermsModal(true)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            서비스 이용약관
          </button>{" "}
          및{" "}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            개인정보 처리방침
          </button>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>

      {/* 모달들 */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}
