"use client";

import { useState, useEffect } from "react";
import AnswerForm from "./AnswerForm";
import TextType from "./ui/TextType";
import ScoreResult from "./ScoreResult";
import { questionService } from "@/lib/services";
import { Question } from "@/lib/database.types";

export default function QuizContainer() {
  const [score, setScore] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    criteriaScores: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    // 백엔드에서 오늘의 문제 로드
    const loadTodaysQuestion = async () => {
      try {
        console.log("Loading today's question...");
        const question = await questionService.getTodaysQuestion();
        console.log("Today's question loaded:", question);
        setCurrentQuestion(question);
      } catch (error) {
        console.error("Failed to load today's question:", error);
        console.error("Error details:", {
          message: (error as Error).message,
          stack: (error as Error).stack,
          name: (error as Error).name,
        });
        // 실패시 첫 번째 활성 문제 로드
        try {
          console.log("Trying to load fallback questions...");
          const questions = await questionService.getActiveQuestions();
          console.log("Fallback questions loaded:", questions);
          if (questions.length > 0) {
            setCurrentQuestion(questions[0]);
          }
        } catch (fallbackError) {
          console.error("Failed to load fallback question:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodaysQuestion();
  }, []);

  const handleRetry = () => {
    setScore(null);
    setShowScore(false);
    setEvaluation(null);
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  if (loading || !currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center">로딩 중...</div>
    );
  }

  return (
    <>
      {/* 점수 결과 표시 */}
      {showScore && score !== null && (
        <ScoreResult
          score={score}
          feedback={evaluation?.feedback}
          criteriaScores={evaluation?.criteriaScores}
          onRetry={handleRetry}
        />
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto pb-32 min-h-[400px]">
        {/* 오늘의 난제 */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="text-center">
              <TextType
                text={[`${formatDate(new Date())}  ${currentQuestion.title}`]}
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
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                  {currentQuestion.content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 답변 입력 영역 - 하단 고정 */}
      {!showScore && (
        <AnswerForm
          questionId={currentQuestion.id}
          onScoreUpdate={(newScore) => {
            setScore(newScore);
            setShowScore(true);
          }}
          onEvaluationComplete={(evaluationResult) => {
            setEvaluation(evaluationResult);
          }}
        />
      )}
    </>
  );
}
