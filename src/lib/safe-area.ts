import { Capacitor } from "@capacitor/core";

export async function initializeSafeArea() {
  const platform = Capacitor.getPlatform();

  if (platform === "android") {
    try {
      const { EdgeToEdge } = await import(
        "@capawesome/capacitor-android-edge-to-edge-support"
      );
      const { StatusBar, Style } = await import("@capacitor/status-bar");

      // Edge-to-edge 활성화 (상태바/네비게이션바 영역까지 웹뷰 확장)
      await EdgeToEdge.enable();

      // 상태바는 overlays 허용 (edge-to-edge이므로)
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setBackgroundColor({ color: "#00000000" }); // 투명
      await StatusBar.setStyle({ style: Style.Dark });

      // 시스템 insets 가져와서 CSS 변수로 세팅
      const insets = await EdgeToEdge.getInsets();
      if (insets) {
        document.documentElement.style.setProperty("--sat", `${insets.top}px`);
        document.documentElement.style.setProperty(
          "--sab",
          `${insets.bottom}px`
        );
        document.documentElement.style.setProperty("--sal", `${insets.left}px`);
        document.documentElement.style.setProperty(
          "--sar",
          `${insets.right}px`
        );
      }
    } catch (error) {
      console.error("Failed to initialize Android Edge-to-Edge:", error);
    }
  } else if (platform === "ios") {
    try {
      const { StatusBar, Style } = await import("@capacitor/status-bar");
      await StatusBar.setStyle({ style: Style.Dark });
      // iOS는 CSS env(safe-area-inset-*) 가 자동으로 동작
      // viewport-fit=cover 설정 필요 (layout.tsx의 meta viewport에 추가)
    } catch (error) {
      console.error("Failed to initialize iOS StatusBar:", error);
    }
  }
}
