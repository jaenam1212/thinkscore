import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import BottomNavigation from "./BottomNavigation";
import AppHeader from "./AppHeader";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function PageLayout({
  children,
  title,
  subtitle,
  className = "",
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftSidebar />

      {/* 메인 모바일 뷰 - 통일된 레이아웃 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-4xl mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {title && subtitle && <AppHeader title={title} subtitle={subtitle} />}

        {/* 메인 컨텐츠 */}
        <div className={`flex-1 overflow-y-auto pb-32 ${className}`}>
          {children}
        </div>

        <BottomNavigation />
      </div>

      <RightSidebar />
    </div>
  );
}
