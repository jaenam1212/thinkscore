/**
 * RevenueCat In-App Purchases
 *
 * 설치: npm install @revenuecat/purchases-capacitor
 *
 * RevenueCat 대시보드 설정:
 * 1. App 생성 (iOS: app.thinkscore.com, Android: app.thinkscore.com)
 * 2. Products 등록 (App Store Connect / Google Play Console에서 먼저 생성)
 * 3. Entitlements 생성 (e.g. "premium")
 * 4. Offerings 생성 (패키지 묶음)
 * 5. Webhook URL: https://api.thinkscore.kr/payments/webhook
 *    Authorization 헤더: REVENUECAT_WEBHOOK_SECRET 값
 */

import { Capacitor } from "@capacitor/core";

// ─── RevenueCat 타입 정의 (패키지 설치 전 컴파일 보장) ────────────────────────

export interface RCProduct {
  productIdentifier: string;
  productType: string;
  localizedTitle: string;
  localizedDescription: string;
  price: number;
  priceString: string;
  currencyCode: string;
  subscriptionPeriod?: string;
  title: string;
  description: string;
}

export interface RCPackage {
  identifier: string;
  packageType: string;
  product: RCProduct;
  offeringIdentifier: string;
}

export interface RCEntitlement {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  periodType: string;
  latestPurchaseDate: string;
  originalPurchaseDate: string;
  expirationDate?: string | null;
  store: string;
  productIdentifier: string;
  isSandbox: boolean;
  unsubscribeDetectedAt?: string | null;
  billingIssueDetectedAt?: string | null;
}

export interface RCCustomerInfo {
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  nonSubscriptionTransactions: unknown[];
  latestExpirationDate?: string | null;
  firstSeen: string;
  originalAppUserId: string;
  requestDate: string;
  allExpirationDates: Record<string, string | null>;
  allPurchaseDates: Record<string, string | null>;
  originalApplicationVersion?: string | null;
  originalPurchaseDate?: string | null;
  managementURL?: string | null;
  entitlements: {
    all: Record<string, RCEntitlement>;
    active: Record<string, RCEntitlement>;
  };
}

export interface RCOffering {
  identifier: string;
  serverDescription: string;
  availablePackages: RCPackage[];
  monthly?: RCPackage | null;
  annual?: RCPackage | null;
  lifetime?: RCPackage | null;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface PurchaseResult {
  success: boolean;
  isPremium: boolean;
  customerInfo?: RCCustomerInfo;
  error?: string;
}

const RC_API_KEY_IOS = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY || "";
const RC_API_KEY_ANDROID = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY || "";

export const PREMIUM_ENTITLEMENT_ID = "premium";

let isConfigured = false;

export async function initializePurchases(userId?: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (isConfigured) return;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");

  const platform = Capacitor.getPlatform();
  const apiKey = platform === "ios" ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;

  if (!apiKey) {
    console.warn(`RevenueCat API key not set for platform: ${platform}`);
    return;
  }

  await Purchases.configure({ apiKey, appUserID: userId || null });
  isConfigured = true;
}

export async function loginToPurchases(userId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  await Purchases.logIn({ appUserID: userId });
}

export async function logoutFromPurchases(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  await Purchases.logOut();
}

export async function getCustomerInfo(): Promise<RCCustomerInfo | null> {
  if (!Capacitor.isNativePlatform()) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  const { customerInfo } = await Purchases.getCustomerInfo();
  return customerInfo as RCCustomerInfo;
}

export async function isPremiumUser(): Promise<boolean> {
  const info = await getCustomerInfo();
  if (!info) return false;
  return !!info.entitlements.active[PREMIUM_ENTITLEMENT_ID];
}

export async function getOfferings(): Promise<RCOffering | null> {
  if (!Capacitor.isNativePlatform()) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  const { current } = await Purchases.getOfferings();
  return current as RCOffering;
}

export async function purchasePackage(pkg: RCPackage): Promise<PurchaseResult> {
  if (!Capacitor.isNativePlatform()) {
    return {
      success: false,
      isPremium: false,
      error: "Native platform required",
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    const info = customerInfo as RCCustomerInfo;
    const isPremium = !!info.entitlements.active[PREMIUM_ENTITLEMENT_ID];
    return { success: true, isPremium, customerInfo: info };
  } catch (err: unknown) {
    const error = err as { userCancelled?: boolean; message?: string };
    if (error.userCancelled)
      return { success: false, isPremium: false, error: "USER_CANCELLED" };
    return {
      success: false,
      isPremium: false,
      error: error.message || "PURCHASE_FAILED",
    };
  }
}

export async function restorePurchases(): Promise<PurchaseResult> {
  if (!Capacitor.isNativePlatform()) {
    return {
      success: false,
      isPremium: false,
      error: "Native platform required",
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Purchases } = require("@revenuecat/purchases-capacitor");
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const info = customerInfo as RCCustomerInfo;
    const isPremium = !!info.entitlements.active[PREMIUM_ENTITLEMENT_ID];
    return { success: true, isPremium, customerInfo: info };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      success: false,
      isPremium: false,
      error: error.message || "RESTORE_FAILED",
    };
  }
}
