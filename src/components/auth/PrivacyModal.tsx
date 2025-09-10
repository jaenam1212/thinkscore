"use client";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden m-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              개인정보 처리방침
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="prose max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                1. 개인정보의 처리목적
              </h3>
              <p className="text-gray-600 mb-3">
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                2. 개인정보의 처리 및 보유기간
              </h3>
              <p className="text-gray-600 mb-3">
                개인정보는 법령에 따른 개인정보 보유·이용기간 또는
                정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
                보유·이용기간 내에서 처리·보유합니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">보유기간</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>회원탈퇴 시까지 (회원탈퇴 요청 시 즉시 삭제)</li>
                  <li>
                    법령에 의한 보존의무가 있는 경우: 해당 법령에서 정한 기간
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                3. 처리하는 개인정보의 항목
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">필수항목</h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>이메일 주소</li>
                    <li>닉네임</li>
                    <li>소셜 로그인 ID</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">선택항목</h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>프로필 이미지</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    자동 수집 항목
                  </h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>IP주소, 접속로그, 서비스 이용기록</li>
                    <li>기기정보 (OS, 브라우저 정보)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                4. 개인정보의 제3자 제공
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                5. 정보주체의 권리·의무 및 행사방법
              </h3>
              <p className="text-gray-600 mb-3">
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                6. 소셜 로그인 서비스
              </h3>
              <p className="text-gray-600 mb-3">
                ThinkScore는 편리한 서비스 이용을 위해 다음과 같은 소셜 로그인
                서비스를 제공합니다:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-medium text-gray-800">카카오 로그인</h4>
                  <p className="text-sm text-gray-600">
                    수집정보: 닉네임, 프로필 이미지, 이메일(선택)
                  </p>
                  <p className="text-sm text-gray-600">
                    카카오의 개인정보처리방침을 따릅니다.
                  </p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-medium text-gray-800">네이버 로그인</h4>
                  <p className="text-sm text-gray-600">
                    수집정보: 닉네임, 프로필 이미지, 이메일
                  </p>
                  <p className="text-sm text-gray-600">
                    네이버의 개인정보처리방침을 따릅니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                7. 개인정보보호책임자
              </h3>
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
                    <strong>연락처:</strong> jaenam1212@gmail.com
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                8. 개인정보 처리방침 변경
              </h3>
              <p className="text-gray-600">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
                변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행
                7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>시행일자: 2025년 8월 1일</p>
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
