"use client";

import { useState } from "react";

interface RegisterFormProps {
  onRegister: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function RegisterForm({
  onRegister,
  onSwitchToLogin,
  isLoading = false,
  error,
}: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    await onRegister(email, password, displayName || undefined);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">회원가입</h2>
        <p className="text-gray-600 mt-2">새 계정을 만드세요</p>
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
            이메일 <span className="text-red-500">*</span>
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
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            닉네임 (선택사항)
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
            placeholder="표시될 이름"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
            placeholder="최소 6자 이상"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호 확인 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
            placeholder="비밀번호를 다시 입력하세요"
            required
            disabled={isLoading}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              비밀번호가 일치하지 않습니다
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            !email.trim() ||
            !password.trim() ||
            password !== confirmPassword ||
            password.length < 6
          }
          className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {isLoading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-slate-800 hover:text-slate-600 font-medium"
            disabled={isLoading}
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}
