const env = process.env;

const parseBool = (value: string | undefined, fallback = false): boolean => {
  if (typeof value === "undefined") {
    return fallback;
  }
  return value === "1" || value.toLowerCase() === "true";
};

export const adConfig = {
  enabled: parseBool(env.NEXT_PUBLIC_ANDROID_ADS_ENABLED, false),
  showTopBanner: parseBool(env.NEXT_PUBLIC_ANDROID_ADS_TOP_BANNER, false),
  showScoreInterstitial: parseBool(
    env.NEXT_PUBLIC_ANDROID_ADS_SCORE_INTERSTITIAL,
    false
  ),
  scoreInterstitialDelaySeconds: Number(
    env.NEXT_PUBLIC_ANDROID_ADS_SCORE_DELAY_SECONDS ?? "15"
  ),
  useTestAds: parseBool(env.NEXT_PUBLIC_ANDROID_ADS_TEST_MODE, true),
  bannerAdUnitId:
    env.NEXT_PUBLIC_ANDROID_ADS_BANNER_UNIT_ID ??
    "ca-app-pub-3940256099942544/6300978111",
  interstitialAdUnitId:
    env.NEXT_PUBLIC_ANDROID_ADS_INTERSTITIAL_UNIT_ID ??
    "ca-app-pub-3940256099942544/1033173712",
};
