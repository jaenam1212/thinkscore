"use client";

import { useState } from "react";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function DiscussionPage() {
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "recent">(
    "all"
  );
  const [selectedCategory, setSelectedCategory] = useState("free");

  // 카테고리 목록
  const categories = [
    { id: "free", name: "자유" },
    { id: "trolley", name: "트롤리 딜레마" },
    { id: "brain_vat", name: "통 속의 뇌" },
    { id: "prisoner", name: "죄수의 딜레마" },
    { id: "ship", name: "테세우스의 배" },
  ];

  // 가짜 게시글 데이터
  const posts = [
    {
      id: 1,
      title: "트롤리 딜레마에서 정말 5명을 구해야 할까요?",
      content:
        "공리주의적 관점에서는 5명을 구하는 것이 맞다고 하는데, 정말 그럴까요? 개인의 존엄성은...",
      author: "철학러버",
      replies: 24,
      likes: 15,
      views: 127,
      createdAt: "2024.08.18 14:30",
      category: "trolley",
    },
    {
      id: 2,
      title: "AI가 의식을 가질 수 있을까요?",
      content:
        "최근 AI 발전을 보면서 드는 생각인데, 과연 AI가 진정한 의식을 가질 수 있을지 궁금합니다.",
      author: "미래학자",
      replies: 18,
      likes: 22,
      views: 89,
      createdAt: "2024.08.18 12:15",
      category: "brain_vat",
    },
    {
      id: 3,
      title: "자유의지는 실제로 존재하는가?",
      content:
        "모든 것이 인과관계로 결정되어 있다면, 우리의 선택은 정말 자유로운 것일까요?",
      author: "결정론자",
      replies: 31,
      likes: 8,
      views: 203,
      createdAt: "2024.08.17 19:45",
      category: "free",
    },
    {
      id: 4,
      title: "완벽한 정의란 무엇인가?",
      content:
        "롤스의 정의론을 읽고 나서 생각해보는데, 과연 완벽한 정의라는 것이 존재할까요?",
      author: "정의구현자",
      replies: 12,
      likes: 19,
      views: 156,
      createdAt: "2024.08.17 16:20",
      category: "prisoner",
    },
    {
      id: 5,
      title: "행복의 정의에 대해",
      content:
        "아리스토텔레스가 말한 에우다이모니아와 현대적 행복 개념의 차이점에 대해 토론해요.",
      author: "행복추구자",
      replies: 7,
      likes: 13,
      views: 98,
      createdAt: "2024.08.17 09:30",
      category: "ship",
    },
  ];

  // 필터링된 게시글
  const filteredPosts = posts.filter(
    (post) => post.category === selectedCategory
  );

  // 선택된 카테고리 정보
  const selectedCategoryInfo = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {/* 헤더 */}
        <header className="p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">포럼</h1>
            <p className="text-sm text-gray-500">자유로운 철학 토론</p>
          </div>

          {/* 종목 드롭다운 */}
          <div className="mb-4">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none text-sm text-gray-700 bg-gray-100 px-4 py-3 pr-10 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
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
        </header>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* 액션 버튼 */}
          <div className="p-4">
            {selectedCategory === "free" ? (
              <button className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium text-sm transition-colors">
                새 토론 시작하기
              </button>
            ) : (
              <button className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium text-sm transition-colors">
                내 점수 공유하기
              </button>
            )}
          </div>

          {/* 게시글 목록 */}
          <div className="px-4 space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-4 border border-gray-200"
              >
                {/* 카테고리 */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {categories.find((cat) => cat.id === post.category)?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.createdAt}
                  </span>
                </div>

                {/* 제목 */}
                <h3 className="font-medium text-gray-900 mb-2 leading-tight">
                  {post.title}
                </h3>

                {/* 내용 미리보기 */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.content}
                </p>

                {/* 작성자 및 통계 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{post.author}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
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
                      <span>{post.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <BottomNavigation />
      </div>

      <RightSidebar />
    </div>
  );
}
