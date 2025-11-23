"use client";

import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import AppHeader from "@/components/layout/AppHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { answerService, scoreService, questionService } from "@/lib/services";
import { Answer } from "@/lib/database.types";
import ScoreResult from "@/components/ScoreResult";
import ProfileEditModal from "@/components/auth/ProfileEditModal";
import CustomerSupportModal from "@/components/CustomerSupportModal";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/LanguageSelector";

interface AnswerWithScore extends Answer {
  question_title?: string;
  score?: number;
  scoreDate?: string;
  feedback?: string;
  criteriaScores?: Record<string, number>;
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [recentAnswers, setRecentAnswers] = useState<AnswerWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerWithScore | null>(
    null
  );
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // 로그인하지 않은 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // 사용자 답변 및 점수 불러오기
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id || !isAuthenticated) return;

      try {
        setLoading(true);

        // 사용자 답변 가져오기
        const answers = await answerService.getUserAnswers(user.id);

        // 각 답변의 점수 정보와 문제 정보 가져오기
        const answersWithScores = await Promise.all(
          answers.map(async (answer) => {
            try {
              const [scores, question] = await Promise.all([
                scoreService.getAnswerScores(answer.id),
                questionService.getQuestion(answer.question_id),
              ]);

              const latestScore =
                scores.length > 0 ? scores[scores.length - 1] : null;

              return {
                ...answer,
                question_title: question.title,
                score: latestScore?.score,
                scoreDate: latestScore?.created_at,
                feedback: latestScore?.reason,
                // 기본 criteriaScores (실제 구현시 latestScore에서 가져와야 함)
                criteriaScores:
                  latestScore?.score !== undefined
                    ? latestScore.score === 0
                      ? {
                          "논리적 사고": 0,
                          "창의적 사고": 0,
                          일관성: 0,
                        }
                      : {
                          "논리적 사고": Math.round(
                            Math.min(
                              100,
                              Math.max(
                                1,
                                latestScore.score + Math.random() * 10 - 5
                              )
                            )
                          ),
                          "창의적 사고": Math.round(
                            Math.min(
                              100,
                              Math.max(
                                1,
                                latestScore.score + Math.random() * 10 - 5
                              )
                            )
                          ),
                          일관성: Math.round(
                            Math.min(
                              100,
                              Math.max(
                                1,
                                latestScore.score + Math.random() * 10 - 5
                              )
                            )
                          ),
                        }
                    : undefined,
              };
            } catch (error) {
              console.error(
                `Error loading data for answer ${answer.id}:`,
                error
              );
              return answer;
            }
          })
        );

        // 최신 순으로 정렬하고 최대 5개만
        const sortedAnswers = answersWithScores
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5);

        setRecentAnswers(sortedAnswers);
      } catch (error) {
        console.error("사용자 데이터 로딩 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    console.log("로그아웃 버튼 클릭됨");
    logout();
    router.push("/");
  };

  // 프로필 데이터
  const profileData = {
    name: user?.displayName || tCommon("user"),
    email: user?.email || t("emailNotProvided"),
    totalTests: recentAnswers.length,
    averageScore:
      recentAnswers.length > 0
        ? Math.round(
            recentAnswers
              .filter((a) => a.score !== undefined)
              .reduce((sum, a) => sum + (a.score || 0), 0) /
              recentAnswers.filter((a) => a.score !== undefined).length
          )
        : 0,
    bestScore:
      recentAnswers.length > 0
        ? Math.max(
            ...recentAnswers
              .filter((a) => a.score !== undefined)
              .map((a) => a.score || 0)
          )
        : 0,
    rank: 7, // 임시 값
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleAnswerClick = (answer: AnswerWithScore) => {
    if (answer.score !== undefined) {
      setSelectedAnswer(answer);
      setShowScoreModal(true);
    }
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setSelectedAnswer(null);
  };

  const handleProfileSave = async (data: {
    email: string;
    displayName: string;
  }) => {
    await updateProfile(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        <AppHeader title={t("title")} subtitle={t("subtitle")} />

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* 프로필 헤더 */}
          <div className="p-6 bg-gradient-to-b from-slate-50 to-stone-50">
            <div className="text-center">
              {/* 프로필 이미지 */}
              <div className="w-24 h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white font-bold">
                  {profileData.name.charAt(0)}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {profileData.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{profileData.email}</p>
            </div>
          </div>

          {/* 통계 카드들 */}
          <div className="px-6 -mt-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {profileData.totalTests}
                </div>
                <div className="text-sm text-gray-600">{t("stats.totalTests")}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {profileData.averageScore}
                </div>
                <div className="text-sm text-gray-600">{t("stats.averageScore")}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {profileData.bestScore}
                </div>
                <div className="text-sm text-gray-600">{t("stats.bestScore")}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  #{profileData.rank}
                </div>
                <div className="text-sm text-gray-600">{t("stats.currentRank")}</div>
              </div>
            </div>

            {/* 최근 답변 기록 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {t("recentAnswers")}
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">{tCommon("loading")}</p>
                </div>
              ) : recentAnswers.length > 0 ? (
                <div className="space-y-3">
                  {recentAnswers.map((answer) => (
                    <div
                      key={answer.id}
                      onClick={() => handleAnswerClick(answer)}
                      className={`bg-white rounded-xl p-4 border border-gray-200 transition-colors ${
                        answer.score !== undefined
                          ? "hover:bg-gray-50 cursor-pointer"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 mb-2">
                            {formatDate(answer.created_at)}{" "}
                            {answer.question_title || `답변 #${answer.id}`}
                          </div>
                          <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {answer.content.substring(0, 100)}
                            {answer.content.length > 100 ? "..." : ""}
                          </div>
                          {answer.score !== undefined && (
                            <div className="text-xs text-blue-600">
                              {t("viewScore")}
                            </div>
                          )}
                        </div>
                        {answer.score !== undefined && (
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-slate-600">
                              {answer.score}점
                            </div>
                            <div className="text-xs text-gray-500">
                              {answer.score >= 90
                                ? t("scoreLabel.excellent")
                                : answer.score >= 80
                                  ? t("scoreLabel.good")
                                  : answer.score >= 60
                                    ? t("scoreLabel.average")
                                    : t("scoreLabel.needsWork")}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <p className="text-gray-500">{t("noAnswers")}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {t("firstAnswer")}
                  </p>
                </div>
              )}
            </div>

            {/* 설정 옵션 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{t("settings.title")}</h3>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{t("settings.notifications")}</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <LanguageSelector />
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{t("settings.editProfile")}</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{t("settings.support")}</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors text-red-600"
                >
                  <span>{t("settings.logout")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>

      <RightSidebar />

      {/* 점수 결과 모달 */}
      {showScoreModal &&
        selectedAnswer &&
        selectedAnswer.score !== undefined && (
          <ScoreResult
            score={selectedAnswer.score}
            feedback={
              selectedAnswer.feedback || t("noFeedback")
            }
            criteriaScores={selectedAnswer.criteriaScores}
            onRetry={handleCloseScoreModal}
            onClose={handleCloseScoreModal}
          />
        )}

      {/* 프로필 수정 모달 */}
      {showEditModal && user && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileSave}
          currentData={{
            email: user.email || "",
            displayName: user.displayName || "",
          }}
        />
      )}

      {/* 고객센터 모달 */}
      <CustomerSupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
