export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto border-t border-gray-200 bg-stone-50 z-20">
      <div className="grid grid-cols-3">
        <button className="flex flex-col items-center py-3 px-4 text-gray-400">
          <svg
            className="w-5 h-5 mb-1"
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
        </button>
        <button className="flex flex-col items-center py-3 px-4 text-slate-700">
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-xs">홈</span>
        </button>
        <button className="flex flex-col items-center py-3 px-4 text-gray-400">
          <svg
            className="w-5 h-5 mb-1"
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
        </button>
      </div>
    </nav>
  );
}
