"use client";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode; // 추가 헤더 콘텐츠 (탭 메뉴 등)
}

export default function AppHeader({
  title,
  subtitle,
  children,
}: AppHeaderProps) {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="ThinkScore Logo"
                width={32}
                height={32}
                className="object-contain rounded"
                unoptimized
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user?.displayName}
                </span>
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {user?.displayName?.charAt(0) || "?"}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                로그인
              </button>
            )}
          </div>
        </div>
        {children && <div>{children}</div>}
      </header>

      {/* 로그인 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
}
