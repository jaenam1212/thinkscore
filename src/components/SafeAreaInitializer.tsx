"use client";

import { useEffect } from "react";
import { initializeSafeArea } from "@/lib/safe-area";

export default function SafeAreaInitializer() {
  useEffect(() => {
    initializeSafeArea();
  }, []);

  return null;
}
