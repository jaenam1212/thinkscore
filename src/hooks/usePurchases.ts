"use client";

import { useState, useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import {
  getOfferings,
  getCustomerInfo,
  purchasePackage,
  restorePurchases,
  PREMIUM_ENTITLEMENT_ID,
  type PurchaseResult,
  type RCPackage,
  type RCOffering,
} from "@/lib/purchases";
import { useAuth } from "@/contexts/AuthContext";

interface UsePurchasesReturn {
  /** 현재 사용자가 프리미엄인지 */
  isPremium: boolean;
  /** 구독 만료 일시 */
  expiresDate: string | null;
  /** 네이티브 앱 환경 여부 */
  isNative: boolean;
  /** 상품 목록 로딩 중 */
  isLoadingOfferings: boolean;
  /** 구매 진행 중 */
  isPurchasing: boolean;
  /** 복원 진행 중 */
  isRestoring: boolean;
  /** RevenueCat Offering (패키지 목록 포함) */
  offering: RCOffering | null;
  /** 구매 실행 */
  purchase: (pkg: RCPackage) => Promise<PurchaseResult>;
  /** 구매 복원 */
  restore: () => Promise<PurchaseResult>;
  /** 상태 새로고침 */
  refresh: () => Promise<void>;
}

export function usePurchases(): UsePurchasesReturn {
  const { user } = useAuth();
  const isNative = Capacitor.isNativePlatform();

  const [isPremium, setIsPremium] = useState(false);
  const [expiresDate, setExpiresDate] = useState<string | null>(null);
  const [offering, setOffering] = useState<RCOffering | null>(null);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const refresh = useCallback(async () => {
    if (!isNative) return;

    const info = await getCustomerInfo();
    if (!info) return;

    const entitlement = info.entitlements.active[PREMIUM_ENTITLEMENT_ID];
    setIsPremium(!!entitlement);
    setExpiresDate(entitlement?.expirationDate || null);
  }, [isNative]);

  const loadOfferings = useCallback(async () => {
    if (!isNative) return;

    setIsLoadingOfferings(true);
    try {
      const current = await getOfferings();
      setOffering(current);
    } finally {
      setIsLoadingOfferings(false);
    }
  }, [isNative]);

  // 초기 로드
  useEffect(() => {
    if (!isNative || !user) return;
    refresh();
    loadOfferings();
  }, [isNative, user, refresh, loadOfferings]);

  const purchase = useCallback(
    async (pkg: RCPackage): Promise<PurchaseResult> => {
      setIsPurchasing(true);
      try {
        const result = await purchasePackage(pkg);
        if (result.success) {
          setIsPremium(result.isPremium);
          if (result.customerInfo) {
            const ent =
              result.customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
            setExpiresDate(ent?.expirationDate || null);
          }
        }
        return result;
      } finally {
        setIsPurchasing(false);
      }
    },
    []
  );

  const restore = useCallback(async (): Promise<PurchaseResult> => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.isPremium) {
        setIsPremium(true);
        if (result.customerInfo) {
          const ent =
            result.customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
          setExpiresDate(ent?.expirationDate || null);
        }
      }
      return result;
    } finally {
      setIsRestoring(false);
    }
  }, []);

  return {
    isPremium,
    expiresDate,
    isNative,
    isLoadingOfferings,
    isPurchasing,
    isRestoring,
    offering,
    purchase,
    restore,
    refresh,
  };
}
