export default function LeftSidebar() {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center lg:p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          ThinkScore 모바일 앱
        </h2>
        <p className="text-gray-600">스마트폰에서 더 편리하게 이용하세요</p>
        <div className="w-32 h-32 bg-white border rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500">QR 코드</span>
        </div>
        <p className="text-sm text-gray-500">QR 코드로 바로 접속</p>
      </div>
    </div>
  );
}
