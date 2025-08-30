"use client";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden m-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              서비스 이용약관
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
                제1조 (목적)
              </h3>
              <p className="text-gray-600">
                이 약관은 ThinkScore(이하 &quot;회사&quot;)가 제공하는 AI 기반
                사고력 평가 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무
                및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제2조 (정의)
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>1. &quot;서비스&quot;</strong>란 회사가 제공하는 AI
                  기반 사고력 평가 플랫폼을 의미합니다.
                </p>
                <p className="text-gray-600">
                  <strong>2. &quot;이용자&quot;</strong>란 회사의 서비스에
                  접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및
                  비회원을 말합니다.
                </p>
                <p className="text-gray-600">
                  <strong>3. &quot;회원&quot;</strong>이란 회사에 개인정보를
                  제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로
                  이용할 수 있는 자를 말합니다.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제3조 (약관의 효력 및 변경)
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>1.</strong> 이 약관은 서비스 화면에 게시하거나 기타의
                  방법으로 이용자에게 공지함으로써 효력을 발생합니다.
                </p>
                <p className="text-gray-600">
                  <strong>2.</strong> 회사는 필요하다고 인정되는 경우 이 약관을
                  변경할 수 있으며, 약관이 변경되는 경우 변경된 약관의 적용일자
                  및 개정사유를 명시하여 현행약관과 함께 그 적용일자 7일
                  이전부터 공지합니다.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제4조 (서비스의 제공 및 변경)
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>1.</strong> 회사는 다음과 같은 업무를 수행합니다:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>AI 기반 사고력 평가 서비스 제공</li>
                  <li>평가 결과 분석 및 피드백 제공</li>
                  <li>포럼 및 커뮤니티 서비스</li>
                  <li>랭킹 및 통계 서비스</li>
                  <li>기타 회사가 정하는 업무</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제5조 (회원가입)
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>1.</strong> 이용자는 회사가 정한 가입 양식에 따라
                  회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써
                  회원가입을 신청합니다.
                </p>
                <p className="text-gray-600">
                  <strong>2.</strong> 회사는 다음과 같은 경우 회원가입을
                  승낙하지 않을 수 있습니다:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>
                    가입신청자가 이 약관에 위배되어 이전에 회원자격을 상실한
                    적이 있는 경우
                  </li>
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>
                    허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지
                    않은 경우
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제6조 (회원의 의무)
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  회원은 다음 행위를 하여서는 안 됩니다:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>신청 또는 변경시 허위내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>
                    회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신
                    또는 게시
                  </li>
                  <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>
                    회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
                  </li>
                  <li>
                    외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에
                    반하는 정보를 회사에 공개 또는 게시하는 행위
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제7조 (저작권의 귀속 및 이용제한)
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>1.</strong> 회사가 작성한 저작물에 대한 저작권 기타
                  지적재산권은 회사에 귀속합니다.
                </p>
                <p className="text-gray-600">
                  <strong>2.</strong> 이용자는 회사를 이용함으로써 얻은 정보 중
                  회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이
                  복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로
                  이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제8조 (계약해지 및 이용제한)
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>1.</strong> 회원이 이용계약을 해지하고자 하는 때에는
                  언제든지 회원 본인이 온라인으로 회사에 해지신청을 할 수
                  있습니다.
                </p>
                <p className="text-gray-600">
                  <strong>2.</strong> 회사는 회원이 다음 각호에 해당하는 행위를
                  하였을 경우 사전통지 없이 이용계약을 해지하거나 또는 기간을
                  정하여 서비스 이용을 중단할 수 있습니다:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>
                    타인의 서비스 이용을 방해하거나 그 정보를 도용하는 등의 행위
                  </li>
                  <li>
                    서비스를 이용하여 법령과 본 약관이 금지하는 행위를 하는 경우
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제9조 (손해배상)
              </h3>
              <p className="text-gray-600">
                회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가
                발생하더라도 동 손해가 회사의 고의 또는 중과실에 의한 경우를
                제외하고는 이에 대하여 책임을 부담하지 아니합니다.
              </p>
            </section>

            <section className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">부칙</h3>
              <p className="text-gray-600">
                본 약관은 2024년 1월 1일부터 적용됩니다.
              </p>
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
