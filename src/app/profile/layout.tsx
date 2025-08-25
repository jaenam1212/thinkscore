import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필 - 나의 사고력 성장 기록",
  description:
    "개인별 사고력 테스트 결과와 성장 과정을 확인하세요. AI 피드백과 함께하는 맞춤형 사고력 향상 가이드를 제공합니다.",
  openGraph: {
    title: "프로필 - 나의 사고력 성장 기록 | ThinkScore",
    description:
      "개인별 사고력 테스트 결과와 성장 과정을 확인하세요. AI 피드백과 함께하는 맞춤형 사고력 향상 가이드를 제공합니다.",
    url: "https://thinkscore.kr/profile",
  },
  twitter: {
    title: "프로필 - 나의 사고력 성장 기록 | ThinkScore",
    description:
      "개인별 사고력 테스트 결과와 성장 과정을 확인하세요. AI 피드백과 함께하는 맞춤형 사고력 향상 가이드를 제공합니다.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
