"use client";

import { useCallback, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/contexts/AuthContext";
import { usePurchases, type UsePurchasesReturn } from "@/hooks/usePurchases";
import {
  fetchMySubscription,
  type SubscriptionStatusDto,
} from "@/lib/premium-access";

/**
 * 프리미엄(월 구독) · 광고 제거 등 동일 entitlement
 * - 네이티브: RevenueCat (usePurchases)
 * - 웹: GET /payments/subscription/me → DB subscriptions (토스 웹훅 등)
 *
 * usePurchases를 한 번만 쓰므로 프리미엄 페이지와 동일 훅 트리에서 이중 상태가 나지 않음
 */
export function usePremiumAccess(): UsePurchasesReturn & {
  webSubscription: SubscriptionStatusDto | null;
} {
  const { user, token } = useAuth();
  const purchases = usePurchases();
  const isNative = purchases.isNative;

  const [webStatus, setWebStatus] = useState<SubscriptionStatusDto | null>(
    null
  );
  const [webLoading, setWebLoading] = useState(false);

  const refreshWeb = useCallback(async () => {
    if (!token) {
      setWebStatus(null);
      return;
    }
    setWebLoading(true);
    try {
      const s = await fetchMySubscription(token);
      setWebStatus(s);
    } finally {
      setWebLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isNative) {
      setWebStatus(null);
      return;
    }
    if (!user) {
      setWebStatus(null);
      return;
    }
    refreshWeb();
  }, [isNative, user, refreshWeb]);

  const refresh = useCallback(async () => {
    await purchases.refresh();
    if (!Capacitor.isNativePlatform()) {
      await refreshWeb();
    }
  }, [purchases, refreshWeb]);

  const isPremium = isNative ? purchases.isPremium : !!webStatus?.is_premium;

  const expiresDate = isNative
    ? purchases.expiresDate
    : (webStatus?.expires_at ?? null);

  return {
    ...purchases,
    isPremium,
    expiresDate,
    isLoadingOfferings:
      purchases.isLoadingOfferings || (!isNative && webLoading),
    refresh,
    webSubscription: !isNative ? webStatus : null,
  };
}
