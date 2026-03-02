import { Capacitor } from "@capacitor/core";

export async function initializeSafeArea() {
  const platform = Capacitor.getPlatform();

  if (platform === "android") {
    try {
      const { EdgeToEdge } =
        await import("@capawesome/capacitor-android-edge-to-edge-support");
      const { StatusBar, Style } = await import("@capacitor/status-bar");

      // Edge-to-edge 활성화 (상태바/네비게이션바 영역까지 웹뷰 확장)
      await EdgeToEdge.enable();

      // 상태바 스타일 설정
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
    } catch (error) {
      console.warn("Failed to initialize safe area:", error);
    }
  }
}
