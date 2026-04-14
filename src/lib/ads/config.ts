const env = process.env;

const parseBool = (value: string | undefined, fallback = false): boolean => {
  if (typeof value === "undefined") {
    return fallback;
  }
  return value === "1" || value.toLowerCase() === "true";
};

export const adConfig = {
  androidEnabled: parseBool(env.NEXT_PUBLIC_ANDROID_ADS_ENABLED, false),
  iosEnabled: parseBool(env.NEXT_PUBLIC_IOS_ADS_ENABLED, false),
  androidShowTopBanner: parseBool(
    env.NEXT_PUBLIC_ANDROID_ADS_TOP_BANNER,
    false
  ),
  iosShowTopBanner: parseBool(env.NEXT_PUBLIC_IOS_ADS_TOP_BANNER, false),
  androidShowScoreInterstitial: parseBool(
    env.NEXT_PUBLIC_ANDROID_ADS_SCORE_INTERSTITIAL,
    false
  ),
  iosShowScoreInterstitial: parseBool(
    env.NEXT_PUBLIC_IOS_ADS_SCORE_INTERSTITIAL,
    false
  ),
  scoreInterstitialDelaySeconds: Number(
    env.NEXT_PUBLIC_ANDROID_ADS_SCORE_DELAY_SECONDS ?? "15"
  ),
  useTestAds: parseBool(env.NEXT_PUBLIC_ANDROID_ADS_TEST_MODE, true),
  androidBannerAdUnitId:
    env.NEXT_PUBLIC_ANDROID_ADS_BANNER_UNIT_ID ??
    "ca-app-pub-3940256099942544/6300978111",
  iosBannerAdUnitId:
    env.NEXT_PUBLIC_IOS_ADS_BANNER_UNIT_ID ??
    "ca-app-pub-3940256099942544/2934735716",
  androidInterstitialAdUnitId:
    env.NEXT_PUBLIC_ANDROID_ADS_INTERSTITIAL_UNIT_ID ??
    "ca-app-pub-3940256099942544/1033173712",
  iosInterstitialAdUnitId:
    env.NEXT_PUBLIC_IOS_ADS_INTERSTITIAL_UNIT_ID ??
    "ca-app-pub-3940256099942544/4411468910",
};
