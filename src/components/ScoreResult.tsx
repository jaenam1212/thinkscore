"use client";

import CountUp from "./ui/CountUp";

interface ScoreResultProps {
  score: number;
  feedback?: string;
  criteriaScores?: Record<string, number>;
  onRetry?: () => void;
  onClose?: () => void;
  question?: {
    title: string;
    content: string;
    description?: string;
  };
  userAnswer?: string;
}

export default function ScoreResult({
  score,
  feedback,
  criteriaScores,
  onRetry,
  onClose,
  question,
}: ScoreResultProps) {
  // 피드백을 강점과 개선점으로 분리
  const parseStrength = (text: string) => {
    const match = text.match(/강점:\s*([^.]*\.?[^개선]*)/);
    return match ? match[1].trim() : "";
  };

  const parseImprovement = (text: string) => {
    const match = text.match(/개선점:\s*(.+)/);
    return match ? match[1].trim() : "";
  };

  const strength = feedback
    ? parseStrength(feedback)
    : "분석이 제공되었습니다.";
  const improvement = feedback
    ? parseImprovement(feedback)
    : "추가 개선 사항을 검토해보세요.";

  // 이미 한국어로 온 경우 그대로 사용, 혹시 영어로 온 경우 매핑
  const criteriaMapping: Record<string, string> = {
    "논리적 사고": "논리적 사고",
    "창의적 사고": "창의적 사고",
    일관성: "일관성",
    // 혹시 이전 데이터에서 영어로 온 경우 대비
    conceptual_analysis: "논리적 사고",
    logical_reasoning: "창의적 사고",
    interpretive_depth: "일관성",
  };

  // 기본값 설정 (AI 데이터가 없을 때만)
  const defaultCriteriaScores = {
    "논리적 사고": 85,
    "창의적 사고": 92,
    일관성: 78,
  };

  // AI 데이터를 한글로 변환
  const mappedCriteria: Record<string, number> = {};
  if (criteriaScores && Object.keys(criteriaScores).length > 0) {
    Object.entries(criteriaScores).forEach(([key, value]) => {
      const koreanKey = criteriaMapping[key] || key;
      mappedCriteria[koreanKey] = value;
    });
  }

  const displayCriteria =
    Object.keys(mappedCriteria).length > 0
      ? mappedCriteria
      : defaultCriteriaScores;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
      onClick={handleBackgroundClick}
    >
      <style jsx>{`
        @keyframes slideUpBounce {
          0% {
            transform: translateY(150px) scale(0.5);
            opacity: 0;
          }
          80% {
            transform: translateY(-10px) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-gray-50 p-4">
        {/* 문제 요약 섹션 */}
        {question && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-2">문제</h2>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {question.title}
            </h3>
            {question.description && (
              <p className="text-xs text-gray-600 mb-2">
                {question.description}
              </p>
            )}
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {question.content.length > 200
                ? `${question.content.substring(0, 200)}...`
                : question.content}
            </p>
          </div>
        )}

        {/* 점수 원 */}
        <div className="flex justify-center mb-4">
          <div
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-200"
            style={{
              animation: "slideUpBounce 0.6s ease-out forwards",
            }}
          >
            <div className="text-slate-800 text-center">
              <CountUp
                from={0}
                to={score}
                direction="up"
                duration={0.3}
                className="text-2xl font-bold"
              />
              <div className="text-xs font-medium text-slate-600">점</div>
            </div>
          </div>
        </div>

        {/* 점수 평가 영역 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 mx-auto w-full  ">
          <h3 className="text-base font-bold text-slate-800 mb-2">점수 평가</h3>
          <div className="space-y-2 mb-2">
            {Object.entries(displayCriteria).map(
              ([criteriaName, criteriaScore]) => (
                <div
                  key={criteriaName}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-slate-600">{criteriaName}</span>
                  <span className="text-xs font-medium text-slate-800">
                    {criteriaScore}점
                  </span>
                </div>
              )
            )}
          </div>

          {/* 점수를 받은 이유 */}
          <div className="mb-3 p-2 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              {feedback ? (
                <>
                  {strength && (
                    <div className="text-xs text-slate-700">
                      <span className="font-medium text-green-700">👍</span>{" "}
                      {strength}
                    </div>
                  )}
                  {improvement && (
                    <div className="text-xs text-slate-700">
                      <span className="font-medium text-blue-700">💡</span>{" "}
                      {improvement}
                    </div>
                  )}
                  {(!strength || !improvement) && (
                    <div className="text-sm text-slate-700">
                      <span className="font-medium text-blue-700">
                        💬 피드백:
                      </span>{" "}
                      {feedback}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed">
                  당신의 답변은 도덕적 딜레마에 대한 깊은 사고를 보여주었습니다.
                  특히 결과보다는 과정을 중시하는 윤리적 판단력이 뛰어납니다.
                </p>
              )}
            </div>
          </div>

          {/* 다른 사용자들과의 비교 */}
          <div className="border-t border-slate-200 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600">평균 72점</span>
              <span className="text-xs font-bold text-slate-800">
                내 점수 {score}점
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <p className="text-xs font-medium text-slate-700">
                평균보다 {Math.abs(score - 72)}점{" "}
                {score >= 72 ? "높음" : "낮음"}
              </p>
            </div>

            {/* 액션 버튼들 */}
            <div className="mt-3 space-y-2 pointer-events-auto">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
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
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>다시하기</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>닫기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
