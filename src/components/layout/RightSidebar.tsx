export default function RightSidebar() {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center lg:p-8">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-sm font-medium">App Store</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.523 15.3414c-.5665.4053-.8477.4827-1.5646.4827-.7169 0-1.0147-.0774-1.5646-.4827L3.8449 7.9868l10.8235 7.3546zM3.8449 16.0132v-8.0264l10.8235 7.3546L3.8449 16.0132zM19.1551 7.9868L8.3316 15.3414l10.8235-7.3546z" />
            </svg>
            <span className="text-sm font-medium">Google Play</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 max-w-xs">
          지금 다운로드하고
          <br />
          어디서나 ThinkScore를 즐기세요
        </p>
      </div>
    </div>
  );
}
