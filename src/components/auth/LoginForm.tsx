"use client";

import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    await onLogin(email, password);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
        <p className="text-gray-600 mt-2">계정에 로그인하세요</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim() || !password.trim()}
          className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
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
          className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors"
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
          <span>Google로 로그인</span>
        </button>

        <button
          onClick={() => alert("Naver 로그인 (준비 중)")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-100 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
          <span>네이버로 로그인</span>
        </button>

        <button
          onClick={() => alert("Kakao 로그인 (준비 중)")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-100 text-black py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
          </svg>
          <span>카카오로 로그인</span>
        </button>

        <button
          onClick={() => alert("Apple 로그인 (준비 중)")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-800 disabled:bg-gray-100 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span>Apple로 로그인</span>
        </button>
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
    </div>
  );
}
