/** 포럼 `score_share` 글 본문 (퀴즈 결과·포럼 점수 공유 공통) */
export function buildScoreSharePostBody(options: {
  userAnswer: string;
  totalScore: number;
  feedback: string;
  criteriaScores?: Record<string, number> | null;
  additionalThoughts?: string;
}): string {
  const cs = options.criteriaScores;
  const criteriaBlock =
    cs && Object.keys(cs).length > 0
      ? `\n${Object.entries(cs)
          .map(([k, v]) => `• ${k}: ${v}점`)
          .join("\n")}\n`
      : "";
  const extra = options.additionalThoughts?.trim();
  return `**📝 내 답변:**
${options.userAnswer}

**🎯 받은 점수:**
• 총점: ${options.totalScore}점
${criteriaBlock ? `**📊 항목별 점수:**${criteriaBlock}` : ""}
**💭 AI 피드백:**
${options.feedback}
${
  extra
    ? `

**🤔 추가 생각:**
${extra}`
    : ""
}`;
}
