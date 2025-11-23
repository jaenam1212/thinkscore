"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export default function LanguageSelector() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "ko", name: t("korean"), flag: "🇰🇷" },
    { code: "en", name: t("english"), flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      // 현재 경로에서 로케일 부분을 제거하고 새로운 로케일로 교체
      const segments = pathname.split("/");
      const currentLocaleInPath = segments[1];

      let newPath;
      if (currentLocaleInPath === "ko" || currentLocaleInPath === "en") {
        // 경로에 로케일이 있는 경우
        segments[1] = newLocale;
        newPath = segments.join("/");
      } else {
        // 경로에 로케일이 없는 경우 (기본 로케일)
        newPath = `/${newLocale}${pathname}`;
      }

      router.push(newPath);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-800">{t("selectLanguage")}</span>
            {currentLanguage && (
              <span className="text-sm text-gray-500">
                {currentLanguage.flag} {currentLanguage.name}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 언어 선택 드롭다운 */}
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isPending}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50 ${
                  lang.code === locale ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-gray-800">{lang.name}</span>
                  </div>
                  {lang.code === locale && (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
