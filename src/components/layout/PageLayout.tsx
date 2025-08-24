import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import BottomNavigation from "./BottomNavigation";

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
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {title && (
          <header className="p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </header>
        )}

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
