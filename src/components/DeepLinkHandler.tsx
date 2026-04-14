"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { isAppRuntime } from "@/lib/platform";

export default function DeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    if (!isAppRuntime()) {
      return;
    }

    const listenerPromise = App.addListener("appUrlOpen", ({ url }) => {
      if (!url?.startsWith("thinkscore://auth/")) {
        return;
      }

      const parsed = new URL(url);
      const providerPath = `/${parsed.hostname}${parsed.pathname}`;
      const nextPath = `${providerPath}${parsed.search}`;
      router.push(nextPath);
    });

    return () => {
      void listenerPromise.then((listener) => listener.remove());
    };
  }, [router]);

  return null;
}
