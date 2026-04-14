import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
} from "@capacitor-community/admob";
import { adConfig } from "@/lib/ads/config";
import { isAndroidAppRuntime } from "@/lib/platform";

let initialized = false;

const canUseAds = () => {
  return isAndroidAppRuntime() && adConfig.enabled;
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
  if (!canUseAds() || !adConfig.showTopBanner) {
    return;
  }

  await initializeAdMob();
  await AdMob.showBanner({
    adId: adConfig.bannerAdUnitId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    isTesting: adConfig.useTestAds,
    margin: 0,
  });
};

export const removeTopBannerAd = async (): Promise<void> => {
  if (!isAndroidAppRuntime()) {
    return;
  }

  await AdMob.removeBanner();
};

export const showScoreInterstitialAd = async (): Promise<void> => {
  if (!canUseAds() || !adConfig.showScoreInterstitial) {
    return;
  }

  await initializeAdMob();
  await AdMob.prepareInterstitial({
    adId: adConfig.interstitialAdUnitId,
    isTesting: adConfig.useTestAds,
    immersiveMode: true,
  });
  await AdMob.showInterstitial();
};
