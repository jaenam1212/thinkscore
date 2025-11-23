import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "랭킹 - 사고력 순위 확인",
  description:
    "ThinkScore 사고력 테스트 상위 랭커들의 성과를 확인하세요. 다양한 사고력 영역별 순위와 전체 랭킹을 제공합니다.",
  openGraph: {
    title: "랭킹 - 사고력 순위 확인 | ThinkScore",
    description:
      "ThinkScore 사고력 테스트 상위 랭커들의 성과를 확인하세요. 다양한 사고력 영역별 순위와 전체 랭킹을 제공합니다.",
    url: "https://thinkscore.kr/ranking",
  },
  twitter: {
    title: "랭킹 - 사고력 순위 확인 | ThinkScore",
    description:
      "ThinkScore 사고력 테스트 상위 랭커들의 성과를 확인하세요. 다양한 사고력 영역별 순위와 전체 랭킹을 제공합니다.",
  },
};

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
