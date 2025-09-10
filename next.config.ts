import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.BUILD_MODE === "mobile" && {
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
    distDir: "out",
  }),
  ...(process.env.BUILD_MODE !== "mobile" && {
    images: {
      domains: ["thinkscore.kr"],
    },
  }),
};

export default nextConfig;
