"use client";

import { useState } from "react";

interface EvaluationResultProps {
  score: number;
  feedback: string;
  criteriaScores: Record<string, number>;
  isLoading?: boolean;
}

export default function EvaluationResult({
  score,
  feedback,
  criteriaScores,
  isLoading = false,
}: EvaluationResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  // 피드백을 강점과 개선점으로 분리 (더 유연한 파싱)
  const parseStrength = (text: string) => {
    const match = text.match(/강점:\s*([^.]*\.?[^개선]*)/);
    return match ? match[1].trim() : "";
  };

  const parseImprovement = (text: string) => {
    const match = text.match(/개선점:\s*(.+)/);
    return match ? match[1].trim() : "";
  };

  const strength = parseStrength(feedback) || "분석이 제공되었습니다.";
  const improvement =
    parseImprovement(feedback) || "추가 개선 사항을 검토해보세요.";

  // 점수에 따른 색상
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md animate-pulse">
        <div className="text-center mb-4">
          <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
          <div className="h-12 bg-gray-200 rounded-full w-20 mx-auto"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border">
      {/* 총점 표시 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">AI 평가 결과</h3>
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(score)} border-4 border-white shadow-lg`}
        >
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
        <p className="text-gray-600 mt-2">총 100점 중</p>
      </div>

      {/* 피드백 */}
      <div className="space-y-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <h4 className="font-semibold text-green-800 mb-1">👍 강점</h4>
          <p className="text-green-700">{strength}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 mb-1">💡 개선점</h4>
          <p className="text-blue-700">{improvement}</p>
        </div>
      </div>

      {/* 세부 점수 버튼 */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {showDetails ? "세부 점수 접기" : "세부 점수 보기"}
        <span className="ml-2">{showDetails ? "▲" : "▼"}</span>
      </button>

      {/* 세부 점수 */}
      {showDetails && (
        <div className="mt-4 space-y-3">
          {Object.entries(criteriaScores).map(([criteria, score]) => (
            <div key={criteria} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{criteria}</span>
                <span className={`font-bold ${getScoreColor(score)}`}>
                  {score}점
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
