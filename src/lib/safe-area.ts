import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

export async function initializeSafeArea() {
  if (Capacitor.getPlatform() === "android") {
    try {
      // First, ensure status bar doesn't overlay
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Enable edge-to-edge mode
      await EdgeToEdge.enable();

      // Set status bar to match header background
      await StatusBar.setBackgroundColor({ color: "#fafaf9" }); // stone-50
      await StatusBar.setStyle({ style: Style.Dark }); // dark icons

      // Force the WebView to respect system insets by applying them manually
      const insets = await EdgeToEdge.getInsets();
      console.log("EdgeToEdge insets:", insets);

      if (insets) {
        // Apply insets to body to prevent content from going under system bars
        document.body.style.paddingTop = `${insets.top}px`;
        document.body.style.paddingBottom = `${insets.bottom}px`;
        document.body.style.paddingLeft = `${insets.left}px`;
        document.body.style.paddingRight = `${insets.right}px`;

        console.log("Applied insets manually:", insets);
      }
    } catch (error) {
      console.error("Failed to initialize Android Edge-to-Edge:", error);
    }
  }
}
