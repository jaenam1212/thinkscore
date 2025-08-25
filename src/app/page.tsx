import QuizContainer from "@/components/QuizContainer";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import AppHeader from "@/components/layout/AppHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* PC 왼쪽 사이드바 */}
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {/* 헤더 */}
        <AppHeader title="ThinkScore" subtitle="지능 테스트" />

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
