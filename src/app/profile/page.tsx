import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function ProfilePage() {
  // 가짜 프로필 데이터
  const profileData = {
    name: "김사용자",
    email: "user@example.com",
    joinDate: "2024.08.15",
    totalTests: 24,
    averageScore: 82,
    bestScore: 98,
    rank: 7,

    recentTests: [
      { date: "2024.08.18", title: "트롤리 딜레마", score: 85 },
      { date: "2024.08.17", title: "죄수의 딜레마", score: 92 },
      { date: "2024.08.16", title: "마시멜로 실험", score: 78 },
      { date: "2024.08.15", title: "도덕적 기계", score: 88 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <LeftSidebar />

      {/* 메인 모바일 뷰 */}
      <div className="min-h-screen bg-stone-50 flex flex-col w-full max-w-md mx-auto md:border-x md:border-gray-200 relative lg:flex-shrink-0">
        {/* 헤더 */}
        <header className="flex items-center justify-center p-4 border-b border-gray-200 bg-stone-50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">프로필</h1>
              <p className="text-sm text-gray-500">내 정보 및 활동</p>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* 프로필 헤더 */}
          <div className="p-6 bg-gradient-to-b from-slate-50 to-stone-50">
            <div className="text-center">
              {/* 프로필 이미지 */}
              <div className="w-24 h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-white font-bold">
                  {profileData.name.charAt(0)}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {profileData.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{profileData.email}</p>
              <p className="text-xs text-gray-500 mb-2">
                가입일: {profileData.joinDate}
              </p>
            </div>
          </div>

          {/* 통계 카드들 */}
          <div className="px-6 -mt-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {profileData.totalTests}
                </div>
                <div className="text-sm text-gray-600">총 테스트</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {profileData.averageScore}
                </div>
                <div className="text-sm text-gray-600">평균 점수</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  {profileData.bestScore}
                </div>
                <div className="text-sm text-gray-600">최고 점수</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-slate-600">
                  #{profileData.rank}
                </div>
                <div className="text-sm text-gray-600">현재 순위</div>
              </div>
            </div>

            {/* 최근 테스트 기록 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                최근 테스트 기록
              </h3>
              <div className="space-y-3">
                {profileData.recentTests.map((test, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {test.title}
                        </div>
                        <div className="text-sm text-gray-500">{test.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-600">
                          {test.score}점
                        </div>
                        <div className="text-xs text-gray-500">
                          {test.score >= 90
                            ? "🏆 우수"
                            : test.score >= 80
                              ? "👍 양호"
                              : "📚 보통"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 설정 옵션 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">설정</h3>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">알림 설정</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">개인정보 수정</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">고객센터</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors text-red-600">
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>

      <RightSidebar />
    </div>
  );
}
