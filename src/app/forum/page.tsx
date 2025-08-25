"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import ForumHeader from "@/components/forum/ForumHeader";
import ForumPostCard from "@/components/forum/ForumPostCard";
import ForumActionButtons from "@/components/forum/ForumActionButtons";
import {
  ForumAPI,
  ForumPost,
  ForumBoard,
  CreatePostData,
} from "@/lib/forum-api";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

interface UserAnswer {
  id: number;
  user_id: string;
  question_id: number;
  content: string;
  created_at: string;
  scores?: Array<{
    score: number;
    reason: string;
  }>;
}

export default function ForumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "recent">(
    "all"
  );
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null); // null = 전체 포럼
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [boards, setBoards] = useState<ForumBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardsLoading, setBoardsLoading] = useState(true);

  // 새 토론 작성 모달 상태
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 점수 공유 모달 상태
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const [userScore, setUserScore] = useState<{
    total_score: number;
    feedback: string;
    criteria_scores?: Record<string, number>;
  } | null>(null);
  const [additionalThoughts, setAdditionalThoughts] = useState("");
  const [loadingScore, setLoadingScore] = useState(false);

  // 게시판 목록 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setBoardsLoading(true);
        const data = await ForumAPI.getBoards();
        setBoards(data);
      } catch (error) {
        console.error("Failed to fetch boards:", error);
        setBoards([]);
      } finally {
        setBoardsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // API에서 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await ForumAPI.getPosts(
          selectedBoard || undefined,
          activeTab
        );
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedBoard, activeTab]);

  // API에서 이미 필터된 데이터를 받으므로 별도 필터링 불필요

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    router.push(`/forum/${postId}`);
  };

  // 새 토론 시작하기 핸들러
  const handleStartNewDiscussion = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setShowNewPostModal(true);
  };

  // 점수 공유하기 핸들러
  const handleShareScore = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!selectedBoard) {
      alert("문제를 선택해주세요.");
      return;
    }

    try {
      setLoadingScore(true);
      setShowScoreModal(true);

      // 실제 API로 사용자 답변과 점수 조회
      const userAnswerData = await apiClient.getUserAnswerForQuestion(
        user.id,
        selectedBoard
      );

      if (!userAnswerData) {
        alert("이 문제에 대한 답변이 없습니다. 먼저 문제를 풀어주세요.");
        setShowScoreModal(false);
        return;
      }

      // 답변과 점수 정보 설정
      setUserAnswer(userAnswerData);

      // 점수 정보가 있으면 설정
      if (userAnswerData.scores && userAnswerData.scores.length > 0) {
        const scoreData = userAnswerData.scores[0]; // 첫 번째 점수 사용
        setUserScore({
          total_score: scoreData.score,
          feedback: scoreData.reason,
        });
      } else {
        setUserScore({
          total_score: 0,
          feedback: "아직 점수가 매겨지지 않았습니다.",
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      alert("데이터를 불러오는데 실패했습니다.");
      setShowScoreModal(false);
    } finally {
      setLoadingScore(false);
    }
  };

  // 새 게시물 작성 핸들러
  const handleCreatePost = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const postData: CreatePostData = {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        category: "free",
        question_id: selectedBoard || undefined,
      };

      await ForumAPI.createPost(postData);

      // 성공 시 모달 닫고 상태 초기화
      setShowNewPostModal(false);
      setNewPostTitle("");
      setNewPostContent("");

      // 게시물 목록 새로고침
      const data = await ForumAPI.getPosts(
        selectedBoard || undefined,
        activeTab
      );
      setPosts(data);

      alert("새 토론이 성공적으로 작성되었습니다!");
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("토론 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowNewPostModal(false);
    setNewPostTitle("");
    setNewPostContent("");
  };

  // 점수 공유 모달 닫기
  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
    setUserAnswer(null);
    setUserScore(null);
    setAdditionalThoughts("");
  };

  // 점수 공유 게시물 작성
  const handleShareScorePost = async () => {
    if (!user || !selectedBoard || !userAnswer || !userScore) {
      return;
    }

    try {
      setIsSubmitting(true);

      const postData: CreatePostData = {
        title: `[${currentBoard?.name}] 내 답변과 점수 공유`,
        content: `**📝 내 답변:**
${userAnswer.content}

**🎯 받은 점수:**
• 총점: ${userScore.total_score}점

**💭 AI 피드백:**
${userScore.feedback}

${
  additionalThoughts.trim()
    ? `**🤔 추가 생각:**
${additionalThoughts.trim()}`
    : ""
}`,
        category: "score_share",
        question_id: selectedBoard,
      };

      await ForumAPI.createPost(postData);

      // 성공 시 모달 닫고 목록 새로고침
      handleCloseScoreModal();
      const data = await ForumAPI.getPosts(selectedBoard, activeTab);
      setPosts(data);

      alert("점수 공유 게시물이 성공적으로 작성되었습니다!");
    } catch (error) {
      console.error("Failed to create score post:", error);
      alert("게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 현재 선택된 게시판 정보
  const currentBoard =
    boards.find((board) => board.id === selectedBoard) || boards[0];

  return (
    <PageLayout title="포럼" subtitle="자유로운 철학 토론">
      {/* 헤더 컨트롤 */}
      <ForumHeader
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        boards={boards}
        boardsLoading={boardsLoading}
      />

      {/* 액션 버튼 */}
      <ForumActionButtons
        selectedBoard={selectedBoard}
        onStartNewDiscussion={handleStartNewDiscussion}
        onShareScore={handleShareScore}
      />

      {/* 게시글 목록 */}
      <div className="px-4 space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">게시글이 없습니다.</div>
          </div>
        ) : (
          posts.map((post) => (
            <ForumPostCard
              key={post.id}
              post={post}
              currentBoard={currentBoard}
              onClick={handlePostClick}
            />
          ))
        )}
      </div>

      {/* 새 토론 작성 모달 */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">새 토론 작성</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

            {/* 모달 내용 */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* 게시판 정보 */}
              <div className="text-sm text-gray-600">
                게시판:{" "}
                <span className="font-medium text-gray-900">
                  {currentBoard?.name || "전체 포럼"}
                </span>
              </div>

              {/* 제목 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="토론 주제를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              {/* 내용 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="토론하고 싶은 내용을 자세히 작성해주세요"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleCreatePost}
                disabled={
                  isSubmitting || !newPostTitle.trim() || !newPostContent.trim()
                }
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 점수 공유 모달 */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                내 점수 공유하기
              </h2>
              <button
                onClick={handleCloseScoreModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

            {/* 모달 내용 */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {loadingScore ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">데이터를 불러오는 중...</div>
                </div>
              ) : (
                <>
                  {/* 문제 정보 */}
                  <div className="text-sm text-gray-600">
                    문제:{" "}
                    <span className="font-medium text-gray-900">
                      {currentBoard?.name}
                    </span>
                  </div>

                  {/* 내 답변 */}
                  {userAnswer && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">
                        📝 내 답변
                      </h3>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {String(userAnswer.content)}
                      </p>
                    </div>
                  )}

                  {/* 점수 */}
                  {userScore && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-3">
                        🎯 받은 점수
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-800">총점</span>
                          <span className="font-bold text-green-900">
                            {userScore.total_score}점
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <div className="text-green-700">논리성</div>
                            <div className="font-medium">
                              {userScore.criteria_scores?.logic || 0}점
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-700">창의성</div>
                            <div className="font-medium">
                              {userScore.criteria_scores?.creativity || 0}점
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-700">깊이</div>
                            <div className="font-medium">
                              {userScore.criteria_scores?.depth || 0}점
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI 피드백 */}
                  {userScore?.feedback && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-medium text-purple-900 mb-2">
                        💭 AI 피드백
                      </h3>
                      <p className="text-sm text-purple-800 leading-relaxed">
                        {userScore.feedback}
                      </p>
                    </div>
                  )}

                  {/* 추가 생각 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      추가로 하고 싶은 말 (선택사항)
                    </label>
                    <textarea
                      value={additionalThoughts}
                      onChange={(e) => setAdditionalThoughts(e.target.value)}
                      placeholder="다른 사람들과 공유하고 싶은 추가 생각이 있다면 작성해주세요..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={handleCloseScoreModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleShareScorePost}
                disabled={
                  isSubmitting || loadingScore || !userAnswer || !userScore
                }
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "공유 중..." : "공유하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
