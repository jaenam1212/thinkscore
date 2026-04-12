"use client";

import { usePremiumAccess } from "@/hooks/usePremiumAccess";

/**
 * 프리미엄(월 구독)이면 렌더하지 않음 → 광고 제거 UX
 * 비프리미엄일 때만 AdSense 등을 이 영역에 연결
 */
export default function AdSlot() {
  const { isPremium } = usePremiumAccess();

  if (isPremium) return null;

  return (
    <div
      className="shrink-0 border-t border-gray-200 bg-gray-100/80 px-3 py-2 text-center text-[11px] text-gray-400"
      data-ad-slot
      aria-hidden
    >
      {/* Google AdSense / 배너 스크립트 삽입 위치 */}
    </div>
  );
}
