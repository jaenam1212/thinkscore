import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.thinkscore.com",
  appName: "ThinkScore",
  // Next.js 모바일 빌드: BUILD_MODE=mobile → output: "export", distDir: "out" (next.config.ts)
  webDir: "out",
  server: {
    androidScheme: "https",
    cleartext: false,
  },
  android: {
    useLegacyBridge: false,
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    initialFocus: true,
    appendUserAgent: "ThinkScore",
    backgroundColor: "#ffffff",
  },
  plugins: {
    StatusBar: {
      style: "LIGHT", // 밝은 배경 → 검정 아이콘 (배터리/신호 등)
      backgroundColor: "#fafaf9",
      overlaysWebView: false,
    },
  },
};

export default config;
