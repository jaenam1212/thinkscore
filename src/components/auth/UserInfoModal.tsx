"use client";

import { useState } from "react";

interface KakaoProfile {
  id: string;
  nickname?: string;
  email: string;
  profileImage?: string;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (userInfo: { email: string; nickname: string }) => void;
  kakaoProfile: KakaoProfile;
}

export default function UserInfoModal({
  isOpen,
  onClose,
  onComplete,
  kakaoProfile,
}: UserInfoModalProps) {
  const [email, setEmail] = useState(kakaoProfile.email || "");
  const [nickname, setNickname] = useState(kakaoProfile.nickname || "");
  const [errors, setErrors] = useState<{ email?: string; nickname?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; nickname?: string } = {};

    if (!email.trim()) {
      newErrors.email = "이메일은 필수입니다.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!nickname.trim()) {
      newErrors.nickname = "닉네임은 필수입니다.";
    } else if (nickname.trim().length < 2) {
      newErrors.nickname = "닉네임은 2글자 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({ email: email.trim(), nickname: nickname.trim() });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            추가 정보를 입력해주세요
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 text-center">
          {kakaoProfile.profileImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={kakaoProfile.profileImage}
                alt="프로필 이미지"
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
            </>
          )}
          <p className="text-sm text-gray-600">
            카카오 로그인이 완료되었습니다!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nickname ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nickname && (
              <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
