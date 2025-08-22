"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto border-t border-gray-200 bg-stone-50 z-20">
      <div className="grid grid-cols-4">
        <Link
          href="/ranking"
          className={`flex flex-col items-center py-2 px-2 ${pathname === "/ranking" ? "text-slate-700" : "text-gray-400"}`}
        >
          <svg
            className="w-4 h-4 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-xs">랭킹</span>
        </Link>
        <Link
          href="/"
          className={`flex flex-col items-center py-2 px-2 ${pathname === "/" ? "text-slate-700" : "text-gray-400"}`}
        >
          <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-xs">홈</span>
        </Link>
        <Link
          href="/discussion"
          className={`flex flex-col items-center py-2 px-2 ${pathname === "/discussion" ? "text-slate-700" : "text-gray-400"}`}
        >
          <svg
            className="w-4 h-4 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-xs">포럼</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center py-2 px-2 ${pathname === "/profile" ? "text-slate-700" : "text-gray-400"}`}
        >
          <svg
            className="w-4 h-4 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs">프로필</span>
        </Link>
      </div>
    </nav>
  );
}
