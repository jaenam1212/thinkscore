"use client";

import { useEffect } from "react";
import { removeTopBannerAd, showTopBannerAd } from "@/lib/ads/admob";

export default function TopBannerAd() {
  useEffect(() => {
    void showTopBannerAd();

    return () => {
      void removeTopBannerAd();
    };
  }, []);

  return null;
}
