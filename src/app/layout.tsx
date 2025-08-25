import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ThinkScore - AI 기반 사고력 평가 플랫폼",
    template: "%s | ThinkScore",
  },
  description:
    "AI로 평가하는 창의적 사고력 테스트. 논리적 추론, 창의성, 비판적 사고를 종합적으로 측정하고 개인 맞춤형 피드백을 제공합니다.",
  keywords: [
    "사고력",
    "AI",
    "평가",
    "창의성",
    "논리적 추론",
    "비판적 사고",
    "테스트",
    "교육",
    "지능검사",
    "논리력",
    "창의력",
    "비판적 사고",
    "평가",
    "테스트",
    "교육",
    "논리력 검사",
    "창의력 검사",
    "비판적 사고 검사",
    "지능 검사 플랫폼",
    "논리력 검사 플랫폼",
    "창의력 검사 플랫폼",
    "비판적 사고 검사 플랫폼",
    "평가 플랫폼",
  ],
  authors: [{ name: "ThinkScore" }],
  creator: "ThinkScore",
  publisher: "ThinkScore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://thinkscore.kr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://thinkscore.kr",
    title: "ThinkScore - AI 기반 사고력 평가 플랫폼",
    description:
      "AI로 평가하는 창의적 사고력 테스트. 논리적 추론, 창의성, 비판적 사고를 종합적으로 측정하고 개인 맞춤형 피드백을 제공합니다.",
    siteName: "ThinkScore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ThinkScore - AI 기반 사고력 평가 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThinkScore - AI 기반 사고력 평가 플랫폼",
    description:
      "AI로 평가하는 창의적 사고력 테스트. 논리적 추론, 창의성, 비판적 사고를 종합적으로 측정하고 개인 맞춤형 피드백을 제공합니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          strategy="beforeInteractive"
        />
        <StructuredData type="website" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
