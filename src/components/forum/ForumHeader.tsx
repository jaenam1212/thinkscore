import { ForumBoard } from "@/lib/forum-api";

interface ForumHeaderProps {
  selectedBoard: number | null;
  setSelectedBoard: (board: number | null) => void;
  activeTab: "all" | "popular" | "recent";
  setActiveTab: (tab: "all" | "popular" | "recent") => void;
  boards: ForumBoard[];
  boardsLoading: boolean;
}

export default function ForumHeader({
  selectedBoard,
  setSelectedBoard,
  activeTab,
  setActiveTab,
  boards,
  boardsLoading,
}: ForumHeaderProps) {
  return (
    <div className="p-4 space-y-4">
      {/* 게시판 드롭다운 */}
      <div className="relative">
        <select
          value={selectedBoard || ""}
          onChange={(e) =>
            setSelectedBoard(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full appearance-none text-sm text-gray-700 bg-gray-100 px-4 py-3 pr-10 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          disabled={boardsLoading}
        >
          {boardsLoading ? (
            <option>로딩 중...</option>
          ) : (
            boards.map((board) => (
              <option key={board.id || "general"} value={board.id || ""}>
                {board.name}
              </option>
            ))
          )}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
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
      </div>

      {/* 탭 메뉴 */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-white text-slate-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "popular"
              ? "bg-white text-slate-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          인기
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "recent"
              ? "bg-white text-slate-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          최신
        </button>
      </div>
    </div>
  );
}
