"use client";

import { useState, useEffect } from "react";
import AnswerForm from "./AnswerForm";
import TextType from "./ui/TextType";
import ScoreResult from "./ScoreResult";
import AuthModal from "./auth/AuthModal";
import { questionService } from "@/lib/services";
import { Question } from "@/lib/database.types";
import { useAuth } from "@/contexts/AuthContext";

type QuestionListItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
};

export default function QuizContainer() {
  const { user, isLoading: authLoading } = useAuth();
  const [score, setScore] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    criteriaScores: Record<string, number>;
  } | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "select" | "essay">(
    "today"
  );
  const [questionsList, setQuestionsList] = useState<QuestionListItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState<string>("");

  useEffect(() => {
    const loadTodaysQuestion = async () => {
      try {
        const question = await questionService.getTodaysQuestion();
        setCurrentQuestion(question);
      } catch {
        try {
          const questions = await questionService.getActiveQuestions();
          if (questions.length > 0) setCurrentQuestion(questions[0]);
        } catch {
          // no fallback available
        }
      } finally {
        setLoading(false);
      }
    };
    loadTodaysQuestion();
  }, []);

  // 문제 목록 로드 (선택 모드용)
  const loadQuestionsList = async () => {
    try {
      const questions = await questionService.getQuestionsList();
      setQuestionsList(questions);
    } catch (error) {
      console.error("Failed to load questions list:", error);
    }
  };

  // 특정 문제 로드
  const loadSpecificQuestion = async (questionId: number) => {
    setLoading(true);
    try {
      const question = await questionService.getQuestion(questionId);
      setCurrentQuestion(question);
      setSelectedQuestionId(questionId);
    } catch (error) {
      console.error("Failed to load specific question:", error);
    } finally {
      setLoading(false);
    }
  };

  // 선택 모드 토글
  const handleToggleSelectMode = () => {
    if (!isSelectMode) {
      loadQuestionsList();
    }
    setIsSelectMode(!isSelectMode);
    setActiveTab("select");
  };

  // 문제 선택 핸들러
  const handleQuestionSelect = (questionId: number) => {
    loadSpecificQuestion(questionId);
    setIsSelectMode(false);
    // 점수와 평가 초기화
    setScore(null);
    setShowScore(false);
    setEvaluation(null);
  };

  const handleRetry = () => {
    setScore(null);
    setShowScore(false);
    setEvaluation(null);
    setUserAnswer("");
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  // 인증 로딩 중이거나 문제 로딩 중일 때
  if (authLoading || loading || !currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center">로딩 중...</div>
    );
  }

  return (
    <>
      {/* 인증 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />

      {/* 점수 결과 표시 */}
      {showScore && score !== null && (
        <ScoreResult
          score={score}
          feedback={evaluation?.feedback}
          criteriaScores={evaluation?.criteriaScores}
          onRetry={handleRetry}
          onClose={handleRetry}
          question={{
            title: currentQuestion?.title || "",
            content: currentQuestion?.content || "",
            description: currentQuestion?.description || "",
          }}
          userAnswer={userAnswer}
        />
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto pb-32 min-h-[400px]">
        {/* 문제 선택/오늘의 난제 */}
        <div className="p-6">
          {/* 모드 전환 버튼 */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => {
                  setIsSelectMode(false);
                  setActiveTab("today");
                  setSelectedQuestionId(null);
                  setLoading(true);
                  questionService
                    .getTodaysQuestion()
                    .then(setCurrentQuestion)
                    .catch(async () => {
                      const qs = await questionService.getActiveQuestions();
                      if (qs.length > 0) setCurrentQuestion(qs[0]);
                    })
                    .finally(() => setLoading(false));
                }}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeTab === "today"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                오늘의 문제
              </button>
              <button
                onClick={handleToggleSelectMode}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeTab === "select"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                문제 선택
              </button>
              {/* TODO: 입시 논술 기능 추가 예정 */}
              {/*
              <button
                onClick={() => {
                  setIsSelectMode(false);
                  setActiveTab("essay");
                  // 실제 논술 문제로 전환
                  alert("실제 논술 문제 기능은 준비 중입니다!");
                }}
                className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeTab === "essay"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                입시 논술
              </button>
              */}
            </div>
          </div>

          {/* 문제 선택 모드 */}
          {isSelectMode ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">
                문제를 선택하세요
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {questionsList.map((question, index) => (
                  <div
                    key={question.id}
                    onClick={() => handleQuestionSelect(question.id)}
                    className="p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {index + 1}. {question.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {question.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {question.category}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              question.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : question.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 오늘의 난제 */
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="text-center">
                <TextType
                  text={[
                    selectedQuestionId
                      ? currentQuestion.title
                      : `${formatDate(new Date())}  ${currentQuestion.title}`,
                  ]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="_"
                  textColors={["#000000", "#000000", "#000000"]}
                  className="text-2xl"
                />
              </div>
              {!showScore && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    {currentQuestion.description}
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line text-center">
                    {currentQuestion.content}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 답변 입력 영역 - 하단 고정 */}
      {!showScore && !isSelectMode && (
        <AnswerForm
          questionId={currentQuestion.id}
          userId={user?.id || ""}
          onScoreUpdate={(newScore) => {
            setScore(newScore);
            setShowScore(true);
          }}
          onEvaluationComplete={(evaluationResult) => {
            setEvaluation(evaluationResult);
          }}
          onAnswerSubmit={(answer) => {
            setUserAnswer(answer);
          }}
        />
      )}
    </>
  );
}
