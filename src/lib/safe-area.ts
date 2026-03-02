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

      // 상태바/네비게이션바 배경색 설정
      await EdgeToEdge.setBackgroundColor({ color: "#fafaf9" });
      // Style.Light = 어두운 아이콘 (밝은 배경용) / Style.Dark = 밝은 아이콘 (어두운 배경용)
      await StatusBar.setStyle({ style: Style.Light });

      // CSS safe area 변수를 실제 인셋 값으로 설정
      await applySafeAreaInsets(EdgeToEdge);
    } catch (error) {
      console.warn("Failed to initialize safe area:", error);
    }
  }
}

async function applySafeAreaInsets(EdgeToEdge: {
  getInsets?: (...args: unknown[]) => Promise<unknown>;
  enable: () => Promise<void>;
}) {
  try {
    // getInsets() API 사용 시도
    if (typeof EdgeToEdge.getInsets === "function") {
      const result = (await EdgeToEdge.getInsets!()) as {
        insets: { top: number; bottom: number; left: number; right: number };
      };
      const { top, bottom, left, right } = result.insets;
      setSafeAreaCSSVars(top, bottom, left, right);
      return;
    }
  } catch {
    // getInsets 미지원 시 fallback으로 진행
  }

  // Fallback: env() 값을 임시 요소로 측정
  requestAnimationFrame(() => {
    const top = measureEnvInset("safe-area-inset-top");
    const bottom = measureEnvInset("safe-area-inset-bottom");
    const left = measureEnvInset("safe-area-inset-left");
    const right = measureEnvInset("safe-area-inset-right");
    setSafeAreaCSSVars(top, bottom, left, right);
  });
}

function setSafeAreaCSSVars(
  top: number,
  bottom: number,
  left: number,
  right: number
) {
  const root = document.documentElement.style;
  root.setProperty("--sat", `${top}px`);
  root.setProperty("--sab", `${bottom}px`);
  root.setProperty("--sal", `${left}px`);
  root.setProperty("--sar", `${right}px`);
}

function measureEnvInset(envName: string): number {
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.visibility = "hidden";
  el.style.pointerEvents = "none";
  el.style.paddingTop = `env(${envName}, 0px)`;
  document.body.appendChild(el);
  const value = parseFloat(getComputedStyle(el).paddingTop) || 0;
  document.body.removeChild(el);
  return value;
}
