"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import AppHeader from "@/components/layout/AppHeader";
import {
  RankingAPI,
  RankingUser,
  QuestionRankingUser,
  UserRank,
} from "@/lib/ranking-api";
import { questionService } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";
import { Question } from "@/lib/database.types";

export default function RankingPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overall" | "single">("overall");
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  const [overallRankings, setOverallRankings] = useState<RankingUser[]>([]);
  const [questionRankings, setQuestionRankings] = useState<
    QuestionRankingUser[]
  >([]);
  const [myOverallRank, setMyOverallRank] = useState<UserRank | null>(null);
  const [myQuestionRank, setMyQuestionRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 질문 목록 로드
        const questionsData = await questionService.getActiveQuestions();
        setQuestions(questionsData);
        if (questionsData.length > 0 && selectedProblem === null) {
          setSelectedProblem(questionsData[0].id);
        }

        // 종합 랭킹 로드
        if (activeTab === "overall") {
          const rankings = await RankingAPI.getOverallRankings(50);
          setOverallRankings(rankings);

          if (isAuthenticated && user) {
            const myRank = await RankingAPI.getMyOverallRank();
            setMyOverallRank(myRank);
          }
        }

        // 문제별 랭킹 로드
        if (activeTab === "single" && selectedProblem) {
          const rankings = await RankingAPI.getQuestionRankings(
            selectedProblem,
            50
          );
          setQuestionRankings(rankings);

          if (isAuthenticated && user) {
            const myRank = await RankingAPI.getMyQuestionRank(selectedProblem);
            setMyQuestionRank(myRank);
          }
        }
      } catch (error) {
        console.error("Failed to load ranking data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, selectedProblem, isAuthenticated, user]);

  // 현재 랭킹 데이터 및 순위 정보
  const currentRankings =
    activeTab === "overall" ? overallRankings : questionRankings;
  const myCurrentRank =
    activeTab === "overall" ? myOverallRank : myQuestionRank;

  // 뱃지 생성 함수
  const getBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  // 사용자명 표시 함수
  const getDisplayName = (ranking: RankingUser | QuestionRankingUser) => {
    return ranking.display_name || "비회원";
  };

  // 점수 표시 함수
  const getScore = (ranking: RankingUser | QuestionRankingUser) => {
    if (activeTab === "overall") {
      return Math.round((ranking as RankingUser).average_score);
    } else {
      return Math.round((ranking as QuestionRankingUser).question_score);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        <AppHeader title="랭킹" subtitle="사용자 순위">
          {/* 탭 메뉴 - 임시로 종합 랭킹만 표시 */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("overall")}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-white text-slate-700 shadow-sm"
            >
              종합 랭킹
            </button>
            {/* 문제별 랭킹 임시 비활성화
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
            */}
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
                  {currentRankings[1]
                    ? getDisplayName(currentRankings[1])
                    : "-"}
                </div>
                <div className="text-xs text-gray-600">
                  {currentRankings[1] ? getScore(currentRankings[1]) : 0}점
                </div>
              </div>

              {/* 1등 */}
              <div className="text-center">
                <div className="w-20 h-24 bg-yellow-400 rounded-lg flex items-center justify-center mb-2 border-2 border-yellow-500">
                  <span className="text-3xl">🥇</span>
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {currentRankings[0]
                    ? getDisplayName(currentRankings[0])
                    : "-"}
                </div>
                <div className="text-xs text-gray-600">
                  {currentRankings[0] ? getScore(currentRankings[0]) : 0}점
                </div>
              </div>

              {/* 3등 */}
              <div className="text-center">
                <div className="w-16 h-20 bg-orange-400 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🥉</span>
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {currentRankings[2]
                    ? getDisplayName(currentRankings[2])
                    : "-"}
                </div>
                <div className="text-xs text-gray-600">
                  {currentRankings[2] ? getScore(currentRankings[2]) : 0}점
                </div>
              </div>
            </div>
          </div>

          {/* 전체 랭킹 리스트 */}
          <div className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">종합 랭킹</h2>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : currentRankings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">랭킹 데이터가 없습니다.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {currentRankings.map((ranking, index) => {
                  const isMe = user && ranking.id === user.id;
                  const rank = ranking.rank_position;
                  const badge = getBadge(rank);
                  const displayName = getDisplayName(ranking);
                  const score = getScore(ranking);

                  return (
                    <div
                      key={ranking.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        isMe
                          ? "bg-slate-50 border-2 border-slate-300"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">
                            {badge || rank}
                          </span>
                        </div>
                        <div>
                          <div
                            className={`font-medium ${isMe ? "text-slate-700" : "text-gray-800"}`}
                          >
                            {displayName} {isMe && "(나)"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {rank <= 3
                              ? "🏆 상위 3%"
                              : `상위 ${Math.floor((rank / currentRankings.length) * 100)}%`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${isMe ? "text-slate-700" : "text-gray-800"}`}
                        >
                          {score}점
                        </div>
                        <div className="text-xs text-gray-500">
                          {activeTab === "overall"
                            ? `${(ranking as RankingUser).answer_count}회 참여`
                            : `${(ranking as QuestionRankingUser).question_answer_count}회 답변`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 내 순위 요약 - 로그인한 사용자만 표시 */}
            {isAuthenticated && myCurrentRank && (
              <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      myCurrentRank.rank_position === 1
                        ? "bg-yellow-500"
                        : myCurrentRank.rank_position === 2
                          ? "bg-gray-400"
                          : myCurrentRank.rank_position === 3
                            ? "bg-gradient-to-br from-amber-600 to-amber-800"
                            : "bg-slate-500"
                    }`}
                  >
                    <span className="text-white font-bold">
                      {myCurrentRank.rank_position}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      내 현재 순위 (종합)
                    </div>
                    <div className="text-sm text-gray-600">
                      상위 {myCurrentRank.percentile}% •{" "}
                      {Math.round(myCurrentRank.user_score)}점 평균
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 비로그인 사용자 안내 */}
            {!isAuthenticated && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  로그인하시면 내 순위를 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <BottomNavigation />
      </div>

      <RightSidebar />
    </div>
  );
}
