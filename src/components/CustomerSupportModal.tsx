"use client";

import { useState } from "react";

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerSupportModal({
  isOpen,
  onClose,
}: CustomerSupportModalProps) {
  const [copied, setCopied] = useState(false);
  const email = "jaenam1212@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleEmailClick = () => {
    window.open(`mailto:${email}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">고객센터</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            문의사항이나 버그 리포트가 있으시면 아래 이메일로 연락해주세요. 빠른
            시일 내에 답변드리겠습니다.
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">이메일 주소</p>
                <p className="text-blue-600 font-medium">{email}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
                <button
                  onClick={handleEmailClick}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  메일 보내기
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">
              문의 시 포함해주세요
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 사용자 ID 또는 이메일</li>
              <li>• 문의 내용 (구체적으로)</li>
              <li>• 발생 시점 및 상황</li>
              <li>• 사용 중인 기기/브라우저</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">사업자 정보</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">상호:</span> 파도
              </p>
              <p>
                <span className="font-semibold">대표자:</span> 이재남
              </p>
              <p>
                <span className="font-semibold">사업자 등록번호:</span>{" "}
                898-62-00763
              </p>
              <p>
                <span className="font-semibold">주소:</span> 서울 양천구 목동
                520-5
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">약관 및 정책</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.open("/terms", "_blank")}
                className="text-left text-sm text-blue-600"
              >
                <span className="font-semibold">이용약관</span>
              </button>
              <button
                onClick={() => window.open("/privacy", "_blank")}
                className="text-left text-sm text-blue-600"
              >
                <span className="font-semibold">개인정보 처리방침</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
