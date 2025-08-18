"use client";

import { useState } from "react";

export default function Home() {
  const [answer, setAnswer] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setAnswer(e.target.value);

      // 자동 높이 조절
      e.target.style.height = "auto";
      const newHeight = Math.min(e.target.scrollHeight, 256); // 최대 256px (h-64)
      e.target.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto md:border-x md:border-gray-200 relative">
      {/* 헤더 */}
      <header className="flex items-center justify-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ThinkScore</h1>
            <p className="text-sm text-gray-500">지능 테스트</p>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* 오늘의 난제 */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              8/18 - 트롤리 딜레마
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              당신은 철도 분기점 근처에 서 있습니다. 폭주하는 트롤리가 직진하면
              선로에 묶여 있는 5명의 사람을 치어 죽일 것입니다.
              <br />
              <br />
              당신 앞에는 레버가 있어서, 이를 당기면 트롤리를 옆 선로로 돌릴 수
              있습니다. 하지만 옆 선로에는 1명이 묶여 있어 그 사람이 죽게
              됩니다.
              <br />
              <br />
              당신은 레버를 당겨 5명을 구하고 1명을 희생시키겠습니까, 아니면
              아무것도 하지 않겠습니까?
            </p>
          </div>
        </div>
      </div>

      {/* 답변 입력 영역 - 하단 고정 */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-200 z-10">
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
            <button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
              제출하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto border-t border-gray-200 bg-white z-20">
        <div className="grid grid-cols-3">
          <button className="flex flex-col items-center py-3 px-4 text-gray-400">
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-xs">랭킹</span>
          </button>
          <button className="flex flex-col items-center py-3 px-4 text-slate-700">
            <svg
              className="w-5 h-5 mb-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs">홈</span>
          </button>
          <button className="flex flex-col items-center py-3 px-4 text-gray-400">
            <svg
              className="w-5 h-5 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs">프로필</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
