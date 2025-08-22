import QuizContainer from "@/components/QuizContainer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* PC 왼쪽 사이드바 */}
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {/* 헤더 */}
        <header className="flex items-center justify-center p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">ThinkScore</h1>
              <p className="text-sm text-gray-500">지능 테스트</p>
            </div>
          </div>
        </header>

        {/* 퀴즈 컨테이너 */}
        <QuizContainer />

        {/* 하단 네비게이션 */}
        <BottomNavigation />
      </div>

      {/* PC 오른쪽 사이드바 */}
      <RightSidebar />
    </div>
  );
}
