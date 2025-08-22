"use client";

import { useState } from "react";
import QuizContainer from "@/components/QuizContainer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LoginModal from "@/components/auth/LoginModal";

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* PC 왼쪽 사이드바 */}
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {/* 헤더 */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">ThinkScore</h1>
              <p className="text-sm text-gray-500">지능 테스트</p>
            </div>
          </div>
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 text-sm border border-stone-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>로그인</span>
          </button>
        </header>

        {/* 퀴즈 컨테이너 */}
        <QuizContainer />

        {/* 하단 네비게이션 */}
        <BottomNavigation />
      </div>

      {/* PC 오른쪽 사이드바 */}
      <RightSidebar />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
