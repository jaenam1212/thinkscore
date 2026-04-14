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

export const isIOSAppRuntime = (): boolean => {
  if (!isAppRuntime() || typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

export const getAppPlatform = (): "android" | "ios" | "web" => {
  if (isAndroidAppRuntime()) {
    return "android";
  }
  if (isIOSAppRuntime()) {
    return "ios";
  }
  return "web";
};

export const buildAppReturnUrl = (
  provider: "google" | "kakao" | "apple"
): string => {
  return `thinkscore://auth/${provider}/callback`;
};
