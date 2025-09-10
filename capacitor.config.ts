import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.thinkscore.com",
  appName: "ThinkScore",
  webDir: ".next",
  server: {
    androidScheme: "https",
    url: "https://www.thinkscore.kr",
    cleartext: false,
  },
};

export default config;
