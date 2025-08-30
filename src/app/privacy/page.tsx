import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "ThinkScore의 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            개인정보 처리방침
          </h1>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. 개인정보의 처리목적
              </h2>
              <p className="text-gray-600 mb-4">
                ThinkScore는 다음의 목적을 위하여 개인정보를 처리합니다.
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지
                않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에
                따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>회원가입 및 관리</li>
                <li>서비스 제공 및 운영</li>
                <li>사고력 평가 결과 제공</li>
                <li>고객 지원 및 문의 응답</li>
                <li>서비스 개선 및 통계 분석</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. 개인정보의 처리 및 보유기간
              </h2>
              <p className="text-gray-600 mb-4">
                개인정보는 법령에 따른 개인정보 보유·이용기간 또는
                정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
                보유·이용기간 내에서 처리·보유합니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">보유기간</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>회원탈퇴 시까지 (회원탈퇴 요청 시 즉시 삭제)</li>
                  <li>
                    법령에 의한 보존의무가 있는 경우: 해당 법령에서 정한 기간
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. 처리하는 개인정보의 항목
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">필수항목</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>이메일 주소</li>
                    <li>닉네임</li>
                    <li>소셜 로그인 ID (카카오, 네이버)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">선택항목</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>프로필 이미지</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">
                    자동 수집 항목
                  </h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>IP주소, 접속로그, 서비스 이용기록</li>
                    <li>기기정보 (OS, 브라우저 정보)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-gray-600">
                원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의
                경우에는 예외로 합니다:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mt-2">
                <li>정보주체로부터 별도의 동의를 받은 경우</li>
                <li>
                  법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                  방법에 따라 수사기관의 요구가 있는 경우
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. 정보주체의 권리·의무 및 행사방법
              </h2>
              <p className="text-gray-600 mb-4">
                정보주체는 다음과 같은 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>개인정보 처리정지 요구</li>
                <li>개인정보 열람요구</li>
                <li>개인정보 정정·삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                6. 개인정보의 안전성 확보조치
              </h2>
              <p className="text-gray-600 mb-4">
                개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
                있습니다:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>개인정보 취급 담당자의 최소한 지정 및 교육</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보에 대한 접근 제한</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                7. 개인정보보호책임자
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
                  관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
                  개인정보보호책임자를 지정하고 있습니다.
                </p>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>개인정보보호책임자:</strong> ThinkScore 운영팀
                  </p>
                  <p>
                    <strong>연락처:</strong> contact@thinkscore.com
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                8. 소셜 로그인 서비스
              </h2>
              <p className="text-gray-600 mb-4">
                ThinkScore는 편리한 서비스 이용을 위해 다음과 같은 소셜 로그인
                서비스를 제공합니다:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h3 className="font-medium text-gray-800">카카오 로그인</h3>
                  <p className="text-sm text-gray-600">
                    수집정보: 닉네임, 프로필 이미지, 이메일(선택)
                  </p>
                  <p className="text-sm text-gray-600">
                    카카오의 개인정보처리방침을 따릅니다.
                  </p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h3 className="font-medium text-gray-800">네이버 로그인</h3>
                  <p className="text-sm text-gray-600">
                    수집정보: 닉네임, 프로필 이미지, 이메일
                  </p>
                  <p className="text-sm text-gray-600">
                    네이버의 개인정보처리방침을 따릅니다.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                9. 개인정보 처리방침 변경
              </h2>
              <p className="text-gray-600">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
                변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행
                7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>시행일자: 2024년 1월 1일</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t text-center">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
