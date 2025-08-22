"use client";

import { useState } from "react";
import AnswerForm from "./AnswerForm";
import TextType from "./ui/TextType";
import ScoreResult from "./ScoreResult";

export default function QuizContainer() {
  const [score, setScore] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);

  const handleRetry = () => {
    setScore(null);
    setShowScore(false);
  };

  return (
    <>
      {/* 점수 결과 표시 */}
      {showScore && score && (
        <ScoreResult score={score} onRetry={handleRetry} />
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto pb-32 min-h-[400px]">
        {/* 오늘의 난제 */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="text-center">
              <TextType
                text={["8월 18일  트롤리 딜레마"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
                textColors={["#000000", "#000000", "#000000"]}
                className="text-2xl"
              />
            </div>
            {!showScore && (
              <p className="text-gray-700 leading-relaxed text-sm">
                당신은 철도 분기점 근처에 서 있습니다. 폭주하는 트롤리가
                직진하면 선로에 묶여 있는 5명의 사람을 치어 죽일 것입니다.
                <br />
                <br />
                당신 앞에는 레버가 있어서, 이를 당기면 트롤리를 옆 선로로 돌릴
                수 있습니다. 하지만 옆 선로에는 1명이 묶여 있어 그 사람이 죽게
                됩니다.
                <br />
                <br />
                당신은 레버를 당겨 5명을 구하고 1명을 희생시키겠습니까, 아니면
                아무것도 하지 않겠습니까?
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 답변 입력 영역 - 하단 고정 */}
      {!showScore && (
        <AnswerForm
          onScoreUpdate={(newScore) => {
            setScore(newScore);
            setShowScore(true);
          }}
        />
      )}
    </>
  );
}
