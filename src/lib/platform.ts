export const isAppRuntime = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const hasThinkScoreAgent = userAgent.includes("thinkscore");
  const hasCapacitorBridge =
    typeof (window as Window & { Capacitor?: unknown }).Capacitor !==
    "undefined";

  return hasThinkScoreAgent || hasCapacitorBridge;
};

export const isAndroidAppRuntime = (): boolean => {
  if (!isAppRuntime() || typeof window === "undefined") {
    return false;
  }

  return /android/i.test(window.navigator.userAgent);
};

export const buildAppReturnUrl = (
  provider: "google" | "kakao" | "apple"
): string => {
  return `thinkscore://auth/${provider}/callback`;
};
