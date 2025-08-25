"use client";

import { useState } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import AppHeader from "@/components/layout/AppHeader";

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"overall" | "single">("overall");
  const [selectedProblem, setSelectedProblem] = useState("trolley");

  // 문제 목록
  const problems = [
    {
      id: "trolley",
      name: "트롤리 딜레마",
      description: "5명 vs 1명의 도덕적 선택",
    },
    {
      id: "prisoner",
      name: "죄수의 딜레마",
      description: "협력과 배신의 게임 이론",
    },
    { id: "veil", name: "무지의 베일", description: "공정한 사회를 위한 원칙" },
    { id: "ship", name: "테세우스의 배", description: "정체성과 변화의 철학" },
    { id: "cave", name: "동굴의 비유", description: "현실과 인식에 대한 성찰" },
  ];

  // 종합 랭킹 데이터
  const overallRankings = [
    { rank: 1, name: "김철수", score: 98, badge: "🥇" },
    { rank: 2, name: "이영희", score: 95, badge: "🥈" },
    { rank: 3, name: "박민수", score: 92, badge: "🥉" },
    { rank: 4, name: "최지영", score: 89, badge: "" },
    { rank: 5, name: "정승호", score: 87, badge: "" },
    { rank: 6, name: "윤서연", score: 85, badge: "" },
    { rank: 7, name: "나자신", score: 82, badge: "👤", isMe: true },
    { rank: 8, name: "한민지", score: 80, badge: "" },
    { rank: 9, name: "오준영", score: 78, badge: "" },
    { rank: 10, name: "임수빈", score: 75, badge: "" },
  ];

  // 랭킹 데이터 타입 정의
  type RankingData = {
    rank: number;
    name: string;
    score: number;
    badge: string;
    isMe?: boolean;
  };

  // 문제별 랭킹 데이터 (문제 ID별로 관리)
  const problemRankings: Record<string, RankingData[]> = {
    trolley: [
      { rank: 1, name: "박민수", score: 98, badge: "🥇" },
      { rank: 2, name: "김철수", score: 95, badge: "🥈" },
      { rank: 3, name: "나자신", score: 92, badge: "🥉", isMe: true },
      { rank: 4, name: "이영희", score: 89, badge: "" },
      { rank: 5, name: "정승호", score: 87, badge: "" },
      { rank: 6, name: "윤서연", score: 85, badge: "" },
      { rank: 7, name: "한민지", score: 82, badge: "" },
      { rank: 8, name: "오준영", score: 80, badge: "" },
      { rank: 9, name: "임수빈", score: 78, badge: "" },
      { rank: 10, name: "최지영", score: 75, badge: "" },
    ],
    prisoner: [
      { rank: 1, name: "이영희", score: 96, badge: "🥇" },
      { rank: 2, name: "나자신", score: 94, badge: "🥈", isMe: true },
      { rank: 3, name: "김철수", score: 91, badge: "🥉" },
      { rank: 4, name: "박민수", score: 88, badge: "" },
      { rank: 5, name: "정승호", score: 85, badge: "" },
      { rank: 6, name: "윤서연", score: 83, badge: "" },
      { rank: 7, name: "한민지", score: 81, badge: "" },
      { rank: 8, name: "오준영", score: 79, badge: "" },
      { rank: 9, name: "임수빈", score: 77, badge: "" },
      { rank: 10, name: "최지영", score: 74, badge: "" },
    ],
    veil: [
      { rank: 1, name: "정승호", score: 95, badge: "🥇" },
      { rank: 2, name: "윤서연", score: 93, badge: "🥈" },
      { rank: 3, name: "박민수", score: 90, badge: "🥉" },
      { rank: 4, name: "나자신", score: 87, badge: "", isMe: true },
      { rank: 5, name: "김철수", score: 85, badge: "" },
      { rank: 6, name: "이영희", score: 83, badge: "" },
      { rank: 7, name: "한민지", score: 81, badge: "" },
      { rank: 8, name: "오준영", score: 79, badge: "" },
      { rank: 9, name: "임수빈", score: 76, badge: "" },
      { rank: 10, name: "최지영", score: 73, badge: "" },
    ],
    ship: [
      { rank: 1, name: "김철수", score: 97, badge: "🥇" },
      { rank: 2, name: "박민수", score: 94, badge: "🥈" },
      { rank: 3, name: "이영희", score: 91, badge: "🥉" },
      { rank: 4, name: "정승호", score: 88, badge: "" },
      { rank: 5, name: "나자신", score: 86, badge: "", isMe: true },
      { rank: 6, name: "윤서연", score: 84, badge: "" },
      { rank: 7, name: "한민지", score: 82, badge: "" },
      { rank: 8, name: "오준영", score: 80, badge: "" },
      { rank: 9, name: "임수빈", score: 77, badge: "" },
      { rank: 10, name: "최지영", score: 75, badge: "" },
    ],
    cave: [
      { rank: 1, name: "윤서연", score: 99, badge: "🥇" },
      { rank: 2, name: "나자신", score: 96, badge: "🥈", isMe: true },
      { rank: 3, name: "정승호", score: 93, badge: "🥉" },
      { rank: 4, name: "김철수", score: 90, badge: "" },
      { rank: 5, name: "박민수", score: 87, badge: "" },
      { rank: 6, name: "이영희", score: 85, badge: "" },
      { rank: 7, name: "한민지", score: 83, badge: "" },
      { rank: 8, name: "오준영", score: 81, badge: "" },
      { rank: 9, name: "임수빈", score: 78, badge: "" },
      { rank: 10, name: "최지영", score: 76, badge: "" },
    ],
  };

  const currentRankings =
    activeTab === "overall"
      ? overallRankings
      : problemRankings[selectedProblem];
  const selectedProblemInfo = problems.find((p) => p.id === selectedProblem);

  // 내 순위 찾기
  const myRank = currentRankings.find((user) => user.isMe)?.rank || 0;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        <AppHeader title="랭킹" subtitle="사용자 순위">
          {/* 탭 메뉴 */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("overall")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "overall"
                  ? "bg-white text-slate-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              종합 랭킹
            </button>
            <button
              onClick={() => setActiveTab("single")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "single"
                  ? "bg-white text-slate-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              문제별 랭킹
            </button>
          </div>
        </AppHeader>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* 상위 3명 포디움 */}
          <div className="p-6 bg-gradient-to-b from-yellow-50 to-stone-50">
            <div className="flex items-end justify-center space-x-4 mb-6">
              {/* 2등 */}
              <div className="text-center">
                <div className="w-16 h-20 bg-gray-300 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🥈</span>
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {currentRankings[1].name}
                </div>
                <div className="text-xs text-gray-600">
                  {currentRankings[1].score}점
                </div>
              </div>

              {/* 1등 */}
              <div className="text-center">
                <div className="w-20 h-24 bg-yellow-400 rounded-lg flex items-center justify-center mb-2 border-2 border-yellow-500">
                  <span className="text-3xl">🥇</span>
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {currentRankings[0].name}
                </div>
                <div className="text-xs text-gray-600">
                  {currentRankings[0].score}점
                </div>
              </div>

              {/* 3등 */}
              <div className="text-center">
                <div className="w-16 h-20 bg-orange-400 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🥉</span>
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {currentRankings[2].name}
                </div>
                <div className="text-xs text-gray-600">
                  {currentRankings[2].score}점
                </div>
              </div>
            </div>
          </div>

          {/* 전체 랭킹 리스트 */}
          <div className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {activeTab === "overall" ? "종합 랭킹" : "문제별 랭킹"}
              </h2>
              {activeTab === "single" && (
                <div className="relative">
                  <select
                    value={selectedProblem}
                    onChange={(e) => setSelectedProblem(e.target.value)}
                    className="appearance-none text-sm text-gray-700 bg-gray-100 px-3 py-1 pr-8 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
                  >
                    {problems.map((problem) => (
                      <option key={problem.id} value={problem.id}>
                        {problem.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {currentRankings.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    user.isMe
                      ? "bg-slate-50 border-2 border-slate-300"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {user.rank <= 3 ? user.badge : user.rank}
                      </span>
                    </div>
                    <div>
                      <div
                        className={`font-medium ${user.isMe ? "text-slate-700" : "text-gray-800"}`}
                      >
                        {user.name} {user.isMe && "(나)"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.rank <= 3
                          ? "🏆 상위 3%"
                          : `상위 ${Math.floor(user.rank / 10) * 10}%`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${user.isMe ? "text-slate-700" : "text-gray-800"}`}
                    >
                      {user.score}점
                    </div>
                    <div className="text-xs text-gray-500">평균 72점</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 내 순위 요약 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    myRank === 1
                      ? "bg-yellow-500"
                      : myRank === 2
                        ? "bg-gray-400"
                        : myRank === 3
                          ? "bg-gradient-to-br from-amber-600 to-amber-800"
                          : "bg-slate-500"
                  }`}
                >
                  <span className="text-white font-bold">{myRank}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-800">
                    내 현재 순위 (
                    {activeTab === "overall"
                      ? "종합"
                      : selectedProblemInfo?.name}
                    )
                  </div>
                  <div className="text-sm text-gray-600">
                    {activeTab === "overall"
                      ? "상위 30% • 평균보다 10점 높음"
                      : "상위 10% • 이 문제에서 우수한 성과!"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>

      <RightSidebar />
    </div>
  );
}
