"use client";

import { useEffect, useState } from "react";
import { ForumAPI } from "@/lib/forum-api";
import { showToast } from "@/components/ui/Toast";
import { buildScoreSharePostBody } from "@/lib/score-share-post";

type ForumQuickShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 게시 성공 시 글 상세로 이동 등 */
  onPosted: (postId: number) => void;
  questionId: number;
  questionTitle: string;
  userAnswer: string;
  totalScore: number;
  feedback: string;
  criteriaScores?: Record<string, number>;
};

export default function ForumQuickShareModal({
  isOpen,
  onClose,
  onPosted,
  questionId,
  questionTitle,
  userAnswer,
  totalScore,
  feedback,
  criteriaScores,
}: ForumQuickShareModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [additionalThoughts, setAdditionalThoughts] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(`[${questionTitle}] 내 답변과 점수 공유`);
    setContent(
      buildScoreSharePostBody({
        userAnswer,
        totalScore,
        feedback: feedback.trim() ? feedback : "(피드백 없음)",
        criteriaScores,
      })
    );
    setAdditionalThoughts("");
    setSubmitting(false);
  }, [isOpen, questionTitle, userAnswer, totalScore, feedback, criteriaScores]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showToast("제목과 내용을 입력해주세요.", "error");
      return;
    }
    try {
      setSubmitting(true);
      const extra = additionalThoughts.trim();
      const finalContent = extra
        ? `${content.trim()}\n\n**🤔 추가 생각:**\n${extra}`
        : content.trim();

      const post = await ForumAPI.createPost({
        title: title.trim(),
        content: finalContent,
        category: "score_share",
        question_id: questionId,
      });
      showToast("커뮤니티에 올렸어요.", "success");
      onPosted(post.id);
      onClose();
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "게시에 실패했습니다.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-share-title"
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <h2
            id="quick-share-title"
            className="text-lg font-bold text-gray-900"
          >
            커뮤니티에 올리기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={submitting}
          >
            <svg
              className="w-5 h-5"
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

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <p className="text-xs text-gray-600">
            제목과 본문을 고친 뒤 올리면 바로 게시됩니다. 포럼에서 댓글로 더
            이야기할 수 있어요.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              본문
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              추가로 붙일 말 (선택)
            </label>
            <textarea
              value={additionalThoughts}
              onChange={(e) => setAdditionalThoughts(e.target.value)}
              rows={3}
              placeholder="의견을 더 받고 싶은 점, 자랑, 질문 등"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {submitting ? "올리는 중..." : "올리기"}
          </button>
        </div>
      </div>
    </div>
  );
}
