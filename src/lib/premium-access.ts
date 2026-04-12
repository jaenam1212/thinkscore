const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface SubscriptionStatusDto {
  user_id: string;
  is_premium: boolean;
  plan_id: string | null;
  expires_at: string | null;
  store: string | null;
  environment: string | null;
  updated_at: string;
}

/** 로그인 사용자 본인 구독 (DB). 토스·RevenueCat 웹훅이 반영한 subscriptions 기준 */
export async function fetchMySubscription(
  token: string
): Promise<SubscriptionStatusDto | null> {
  const res = await fetch(`${API_BASE}/payments/subscription/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const raw: unknown = await res.json();
  if (raw == null || typeof raw !== "object") return null;
  return raw as SubscriptionStatusDto;
}
