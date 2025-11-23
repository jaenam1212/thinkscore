import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  // 지원하는 모든 로케일
  locales,

  // 기본 로케일
  defaultLocale,

  // 로케일을 URL에 항상 포함
  localePrefix: "as-needed",

  // 로케일 감지 활성화
  localeDetection: true,
});

export const config = {
  // i18n 라우팅이 필요한 경로 설정
  matcher: [
    // 모든 경로에 적용하되, api, _next/static, _next/image, favicon.ico 등은 제외
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|og-image.png).*)",
  ],
};
