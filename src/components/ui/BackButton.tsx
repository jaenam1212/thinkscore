"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      이전 페이지로 돌아가기
    </button>
  );
}
