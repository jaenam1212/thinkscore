"use client";

import { useState } from "react";
import { usePurchases } from "@/hooks/usePurchases";
import { showToast } from "@/components/ui/Toast";
import PageLayout from "@/components/layout/PageLayout";
import type { RCPackage } from "@/lib/purchases";

const FEATURES = [
  {
    icon: "🧠",
    title: "무제한 AI 평가",
    description: "하루 평가 횟수 제한 없이 답변 평가",
  },
  {
    icon: "📊",
    title: "심화 점수 분석",
    description: "세부 기준별 점수와 개선 포인트 제공",
  },
  {
    icon: "📝",
    title: "오답 노트",
    description: "내 답변 히스토리와 성장 추이 확인",
  },
  {
    icon: "🏆",
    title: "전체 랭킹 참여",
    description: "전국 사용자와 실시간 순위 비교",
  },
];

export default function PremiumPage() {
  const {
    isPremium,
    expiresDate,
    isNative,
    isLoadingOfferings,
    isPurchasing,
    isRestoring,
    offering,
    purchase,
    restore,
  } = usePurchases();

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);

  const handlePurchase = async (pkg: RCPackage) => {
    if (isPurchasing) return;
    setSelectedPkgId(pkg.identifier);

    const result = await purchase(pkg);

    if (result.success) {
      showToast("프리미엄 구독이 완료되었습니다! 🎉", "success");
    } else if (result.error === "USER_CANCELLED") {
      // 사용자 취소 — 아무것도 하지 않음
    } else {
      showToast(
        result.error === "PURCHASE_FAILED"
          ? "결제에 실패했습니다. 다시 시도해주세요."
          : `오류: ${result.error}`,
        "error"
      );
    }

    setSelectedPkgId(null);
  };

  const handleRestore = async () => {
    const result = await restore();
    if (result.isPremium) {
      showToast("구매 내역이 복원되었습니다! 🎉", "success");
    } else {
      showToast("복원할 구매 내역이 없습니다.", "info");
    }
  };

  // 이미 프리미엄
  if (isPremium) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            프리미엄 사용 중
          </h1>
          {expiresDate && (
            <p className="text-sm text-gray-500 mb-6">
              {new Date(expiresDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              까지
            </p>
          )}
          <div className="w-full max-w-sm space-y-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 text-left"
              >
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-white px-6 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
            ✨ ThinkScore Premium
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            사고력의 한계를
            <br />
            넘어서세요
          </h1>
          <p className="text-sm text-gray-500">
            AI 기반 심층 분석으로 더 빠른 성장
          </p>
        </div>

        {/* 기능 목록 */}
        <div className="space-y-3 mb-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.description}</p>
              </div>
              <span className="ml-auto text-green-500 text-sm font-bold">
                ✓
              </span>
            </div>
          ))}
        </div>

        {/* 플랜 선택 */}
        {!isNative ? (
          // 웹 환경 — 앱 설치 유도
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              결제는 iOS / Android 앱에서 진행할 수 있습니다
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://apps.apple.com/app/thinkscore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-xl"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=app.thinkscore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-xl"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.18 23.76c.35.2.74.24 1.12.12l11.5-6.64-2.5-2.5-10.12 9.02zm15.64-9.62c.41-.39.68-.93.68-1.62 0-.7-.27-1.24-.68-1.63l-2.1-2.1-2.78 2.78 2.78 2.78 2.1-2.21zm-14.3-9.5c-.22-.07-.46-.05-.68.07L4 4.84 6.5 7.34l2.5-2.5L4.52 4.64zM4 5.16L16.5 12 4 18.84V5.16z" />
                </svg>
                Play Store
              </a>
            </div>
          </div>
        ) : isLoadingOfferings ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : offering ? (
          <div className="space-y-3">
            {offering.availablePackages.map((pkg) => {
              const isMonthly =
                pkg.identifier.includes("monthly") ||
                pkg.packageType === "MONTHLY";
              const isYearly =
                pkg.identifier.includes("annual") ||
                pkg.identifier.includes("yearly") ||
                pkg.packageType === "ANNUAL";
              const isSelected = selectedPkgId === pkg.identifier;

              return (
                <button
                  key={pkg.identifier}
                  onClick={() => handlePurchase(pkg)}
                  disabled={isPurchasing}
                  className={`w-full relative rounded-2xl p-4 border-2 text-left transition-all ${
                    isYearly
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200 bg-white"
                  } ${isPurchasing ? "opacity-60" : "active:scale-[0.98]"}`}
                >
                  {isYearly && (
                    <span className="absolute -top-2.5 left-4 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      베스트
                    </span>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {isYearly
                          ? "연간 구독"
                          : isMonthly
                            ? "월간 구독"
                            : pkg.product.title}
                      </p>
                      {isYearly && (
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                          월간 대비 약 40% 할인
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {pkg.product.priceString}
                      </p>
                      {isYearly && (
                        <p className="text-xs text-gray-400">/ 년</p>
                      )}
                      {isMonthly && (
                        <p className="text-xs text-gray-400">/ 월</p>
                      )}
                    </div>
                  </div>
                  {isSelected && isPurchasing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
                      <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            상품을 불러올 수 없습니다. 네트워크를 확인해주세요.
          </div>
        )}

        {/* 구매 복원 */}
        {isNative && (
          <button
            onClick={handleRestore}
            disabled={isRestoring}
            className="mt-4 w-full text-center text-xs text-gray-400 py-3 disabled:opacity-50"
          >
            {isRestoring ? "복원 중..." : "이전 구매 복원"}
          </button>
        )}

        {/* 법적 고지 */}
        <p className="mt-6 text-center text-xs text-gray-300 leading-relaxed">
          구독은 구매 확인 후 Apple ID / Google Play 계정에 청구됩니다.
          <br />
          구독은 자동 갱신되며, 갱신 24시간 전까지 취소할 수 있습니다.
        </p>
      </div>
    </PageLayout>
  );
}
