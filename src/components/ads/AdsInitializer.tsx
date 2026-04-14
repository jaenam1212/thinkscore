"use client";

import { useEffect } from "react";
import { initializeAdMob } from "@/lib/ads/admob";

export default function AdsInitializer() {
  useEffect(() => {
    void initializeAdMob();
  }, []);

  return null;
}
