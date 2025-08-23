"use client";

import CountUp from "./ui/CountUp";

interface ScoreResultProps {
  score: number;
  feedback?: string;
  criteriaScores?: Record<string, number>;
  onRetry?: () => void;
}

export default function ScoreResult({
  score,
  feedback,
  criteriaScores,
  onRetry,
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

  // 영문 키를 한글로 매핑
  const criteriaMapping: Record<string, string> = {
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
  return (
    <div className="fixed inset-0 flex items-start pt-45 center justify-center z-50 pointer-events-none">
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

      <div className="flex flex-col items-center space-y-6">
        <div
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-200"
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
              className="text-3xl font-bold"
            />
            <div className="text-sm font-medium text-slate-600">점</div>
          </div>
        </div>

        {/* 점수 평가 영역 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 max-w-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3">점수 평가</h3>
          <div className="space-y-3 mb-3">
            {Object.entries(displayCriteria).map(
              ([criteriaName, criteriaScore]) => (
                <div
                  key={criteriaName}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600">{criteriaName}</span>
                  <span className="text-sm font-medium text-slate-800">
                    {criteriaScore}점
                  </span>
                </div>
              )
            )}
          </div>

          {/* 점수를 받은 이유 */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              {feedback ? (
                <>
                  {strength && (
                    <div className="text-sm text-slate-700">
                      <span className="font-medium text-green-700">
                        👍 강점:
                      </span>{" "}
                      {strength}
                    </div>
                  )}
                  {improvement && (
                    <div className="text-sm text-slate-700">
                      <span className="font-medium text-blue-700">
                        💡 개선점:
                      </span>{" "}
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
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-bold text-slate-800 mb-3">
              다른 사용자들과 비교
            </h4>
            <div className="space-y-2 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">평균 점수</span>
                <span className="text-sm font-medium text-slate-800">72점</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">상위 10%</span>
                <span className="text-sm font-medium text-slate-800">89점</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">내 점수</span>
                <span className="text-sm font-bold text-slate-600">
                  {score}점
                </span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-3 text-slate-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-700">
                  평균보다 {score - 72}점 높습니다!
                </p>
              </div>
            </div>

            {/* 다시하기 버튼 */}
            <div className="mt-2 pointer-events-auto">
              <button
                onClick={onRetry}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-4 h-3"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
