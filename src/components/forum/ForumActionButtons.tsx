"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";

interface ForumActionButtonsProps {
  selectedBoard: number | null;
  onStartNewDiscussion: () => void;
  onShareScore: () => void;
}

export default function ForumActionButtons({
  selectedBoard,
  onStartNewDiscussion,
  onShareScore,
}: ForumActionButtonsProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (selectedBoard === null) {
      onStartNewDiscussion();
    } else {
      onShareScore();
    }
  };

  return (
    <>
      <div className="p-4">
        {selectedBoard === null ? (
          <button
            onClick={handleButtonClick}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            {!isAuthenticated ? "로그인 후 토론 시작하기" : "새 토론 시작하기"}
          </button>
        ) : (
          <button
            onClick={handleButtonClick}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            {!isAuthenticated ? "로그인 후 점수 공유하기" : "내 점수 공유하기"}
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
}
