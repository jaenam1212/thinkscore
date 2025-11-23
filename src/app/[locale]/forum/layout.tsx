import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포럼 - 사고력 토론 커뮤니티",
  description:
    "ThinkScore 사용자들과 함께하는 철학적 토론과 창의적 사고 교류의 장. AI 평가 결과를 공유하고 다양한 관점을 나누어보세요.",
  openGraph: {
    title: "포럼 - 사고력 토론 커뮤니티 | ThinkScore",
    description:
      "ThinkScore 사용자들과 함께하는 철학적 토론과 창의적 사고 교류의 장. AI 평가 결과를 공유하고 다양한 관점을 나누어보세요.",
    url: "https://thinkscore.kr/forum",
  },
  twitter: {
    title: "포럼 - 사고력 토론 커뮤니티 | ThinkScore",
    description:
      "ThinkScore 사용자들과 함께하는 철학적 토론과 창의적 사고 교류의 장. AI 평가 결과를 공유하고 다양한 관점을 나누어보세요.",
  },
};

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
