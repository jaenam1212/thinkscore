"use client";

import { useState } from "react";
import { answerService } from "@/lib/services";

interface AnswerFormProps {
  questionId: number;
  userId: string;
  onScoreUpdate?: (score: number) => void;
  onEvaluationComplete?: (evaluation: {
    score: number;
    feedback: string;
    criteriaScores: Record<string, number>;
  }) => void;
  onAnswerSubmit?: (answer: string) => void;
}

export default function AnswerForm({
  questionId,
  userId,
  onScoreUpdate,
  onEvaluationComplete,
  onAnswerSubmit,
}: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      const currentTime = Date.now();

      // 입력 시작 시간 기록
      if (!startTime && e.target.value.length === 1) {
        setStartTime(currentTime);
      }

      // 마지막 키 입력 시간 업데이트
      setLastKeyTime(currentTime);

      setAnswer(e.target.value);

      // 자동 높이 조절
      e.target.style.height = "auto";
      const newHeight = Math.min(e.target.scrollHeight, 256); // 최대 256px (h-64)
      e.target.style.height = `${newHeight}px`;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasteText = e.clipboardData.getData("text");
    if (pasteText.length > 20) {
      e.preventDefault();
      alert("AI 치팅은 허용되지 않습니다.");
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;

    // 입력 속도 검증
    if (startTime && lastKeyTime) {
      const totalTime = lastKeyTime - startTime;
      const typingSpeed = answer.length / (totalTime / 1000); // 초당 글자수

      // 초당 10글자 이상이면 의심
      if (typingSpeed > 10) {
        alert("AI 치팅은 허용되지 않습니다.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // 답변 콜백 호출
      if (onAnswerSubmit) {
        onAnswerSubmit(answer.trim());
      }

      // 1. 답변 제출
      const answerResult = await answerService.createAnswer({
        ...(userId && { user_id: userId }),
        question_id: questionId,
        content: answer.trim(),
        is_anonymous: !userId,
      });

      setIsEvaluating(true);

      // 2. AI 평가 요청
      const evaluationResult = await answerService.evaluateAnswer(
        answerResult.id
      );

      console.log("=== Frontend Evaluation Result ===");
      console.log("evaluationResult:", evaluationResult);

      // 부모 컴포넌트에 점수와 평가 결과 전달
      if (onScoreUpdate) {
        onScoreUpdate(evaluationResult.score);
      }
      if (onEvaluationComplete) {
        onEvaluationComplete(evaluationResult);
      }
    } catch (error) {
      console.error("답변 제출 중 오류:", error);
      alert("답변 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setIsEvaluating(false);
    }
  };

  // 평가 완료 후 기존 ScoreResult로 전환 (모달 비활성화)

  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto p-4 bg-stone-50 border-t border-gray-200 z-10">
      {/* 평가 중일 때 전체 화면 로딩 모달 */}
      {isEvaluating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  AI 평가 중...
                </h3>
                <p className="text-gray-600">
                  GPT-5가 당신의 답변을 분석하고 있습니다
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <span className="text-gray-600 text-sm">
                      논리적 구조 분석
                    </span>
                  </div>
                </div>
                <div
                  className="bg-gray-100 rounded-lg p-3 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="text-gray-600 text-sm">창의성 평가</span>
                  </div>
                </div>
                <div
                  className="bg-gray-100 rounded-lg p-3 animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <span className="text-gray-600 text-sm">일관성 검토</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">평균 소요시간: 3-5초</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl">
        <textarea
          value={answer}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="당신의 생각과 근거를 자유롭게 작성해보세요..."
          className="w-full min-h-[48px] p-4 border-0 rounded-2xl resize-none focus:outline-none text-sm overflow-y-auto"
          rows={1}
          disabled={isSubmitting}
          style={{
            height: "48px",
            maxHeight: "256px",
          }}
        />
        <div className="flex items-center justify-between p-4 pt-0">
          <div className="text-xs text-gray-500">
            {answer.length > 0 ? `${answer.length}자` : "최대 1000자"}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            className="bg-slate-800 hover:bg-slate-900 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
