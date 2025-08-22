"use client";

import { useState } from "react";
import AnimatedContent from "./ui/AnimatedContent";

interface AnswerFormProps {
  onScoreUpdate?: (score: number) => void;
}

export default function AnswerForm({ onScoreUpdate }: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setAnswer(e.target.value);

      // 자동 높이 조절
      e.target.style.height = "auto";
      const newHeight = Math.min(e.target.scrollHeight, 256); // 최대 256px (h-64)
      e.target.style.height = `${newHeight}px`;
    }
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      // 랜덤 점수 생성 (50-100점)
      const randomScore = Math.floor(Math.random() * 51) + 50;
      setScore(randomScore);
      setShowScore(true);

      // 부모 컴포넌트에 점수 전달
      if (onScoreUpdate) {
        onScoreUpdate(randomScore);
      }
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-stone-50 border-t border-gray-200 z-10">
      <div className="bg-white border border-gray-200 rounded-2xl">
        <textarea
          value={answer}
          onChange={handleInputChange}
          placeholder="당신의 생각과 근거를 자유롭게 작성해보세요..."
          className="w-full min-h-[48px] p-4 border-0 rounded-2xl resize-none focus:outline-none text-sm overflow-y-auto"
          rows={1}
          style={{
            height: "48px", // 초기 한 줄 높이
            maxHeight: "256px", // 최대 높이 (기존 h-64와 같음)
          }}
        />
        <div className="flex items-center justify-between p-4 pt-0">
          <div className="text-xs text-gray-500">
            {answer.length > 0 ? `${answer.length}자` : "최대 1000자"}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
