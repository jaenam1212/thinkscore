import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";
import { adConfig } from "@/lib/ads/config";
import { getAppPlatform, isAppRuntime } from "@/lib/platform";

let initialized = false;

const canUseAds = () => {
  const platform = getAppPlatform();
  if (!isAppRuntime()) {
    return false;
  }
  if (platform === "android") {
    return adConfig.androidEnabled;
  }
  if (platform === "ios") {
    return adConfig.iosEnabled;
  }
  return false;
};

const getBannerAdUnitId = (): string => {
  const platform = getAppPlatform();
  return platform === "ios"
    ? adConfig.iosBannerAdUnitId
    : adConfig.androidBannerAdUnitId;
};

const getInterstitialAdUnitId = (): string => {
  const platform = getAppPlatform();
  return platform === "ios"
    ? adConfig.iosInterstitialAdUnitId
    : adConfig.androidInterstitialAdUnitId;
};

const shouldShowTopBanner = (): boolean => {
  const platform = getAppPlatform();
  return platform === "ios"
    ? adConfig.iosShowTopBanner
    : adConfig.androidShowTopBanner;
};

const shouldShowScoreInterstitial = (): boolean => {
  const platform = getAppPlatform();
  return platform === "ios"
    ? adConfig.iosShowScoreInterstitial
    : adConfig.androidShowScoreInterstitial;
};

export const initializeAdMob = async (): Promise<void> => {
  if (!canUseAds() || initialized) {
    return;
  }

  await AdMob.initialize({
    initializeForTesting: adConfig.useTestAds,
  });
  initialized = true;
};

export const showTopBannerAd = async (): Promise<void> => {
  if (!canUseAds() || !shouldShowTopBanner()) {
    return;
  }

  await initializeAdMob();
  await AdMob.showBanner({
    adId: getBannerAdUnitId(),
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    isTesting: adConfig.useTestAds,
    margin: 0,
  });
};

export const removeTopBannerAd = async (): Promise<void> => {
  if (!isAppRuntime()) {
    return;
  }

  await AdMob.removeBanner();
};

export const showScoreInterstitialAd = async (): Promise<void> => {
  if (!canUseAds() || !shouldShowScoreInterstitial()) {
    return;
  }

  await initializeAdMob();
  await AdMob.prepareInterstitial({
    adId: getInterstitialAdUnitId(),
    isTesting: adConfig.useTestAds,
    immersiveMode: true,
  });
  await AdMob.showInterstitial();
};
