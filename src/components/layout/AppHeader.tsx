import Image from "next/image";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode; // 추가 헤더 콘텐츠 (탭 메뉴 등)
}

export default function AppHeader({
  title,
  subtitle,
  children,
}: AppHeaderProps) {
  return (
    <header className="p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="ThinkScore Logo"
            width={32}
            height={32}
            className="object-contain rounded"
            unoptimized
          />
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children && <div>{children}</div>}
    </header>
  );
}
