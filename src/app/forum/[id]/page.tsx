"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/Toast";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { ForumAPI, ForumPost, ForumComment } from "@/lib/forum-api";
import { useAuth } from "@/contexts/AuthContext";

export default function ForumPostPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const postId = parseInt(params.id as string);

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 게시글과 댓글 데이터를 병렬로 가져오기
        const [postData, commentsData] = await Promise.all([
          ForumAPI.getPost(postId),
          ForumAPI.getComments(postId),
        ]);

        setPost(postData);
        setComments(commentsData);

        // 로그인된 사용자의 경우 좋아요 상태와 어드민 상태도 가져오기
        if (isAuthenticated) {
          const [likeStatusData, adminStatusData] = await Promise.all([
            ForumAPI.getLikeStatus(postId),
            ForumAPI.checkAdminStatus(),
          ]);

          // 좋아요 상태와 어드민 상태 설정
          if (likeStatusData && adminStatusData) {
            setIsLiked(likeStatusData.liked);
            setIsAdmin(adminStatusData.isAdmin);
          }
        } else {
          setIsLiked(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to fetch post data:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (postId && !isNaN(postId)) {
      fetchPostData();
    } else {
      setError("잘못된 게시글 ID입니다.");
      setLoading(false);
    }
  }, [postId, isAuthenticated]);

  const handleLike = async () => {
    if (!post || !isAuthenticated) return;

    try {
      const result = await ForumAPI.toggleLike(postId);
      setIsLiked(result.liked);
      setPost({
        ...post,
        likes_count: result.liked ? post.likes_count + 1 : post.likes_count - 1,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleAdminDelete = async () => {
    if (!post || !isAdmin) return;

    const confirmed = confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await ForumAPI.adminDeletePost(postId);
      showToast("게시글이 삭제되었습니다.", "success");
      router.push("/forum");
    } catch (error) {
      showToast("게시글 삭제에 실패했습니다.", "error");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    try {
      const commentData = {
        post_id: postId,
        content: newComment.trim(),
      };

      const newCommentResponse = await ForumAPI.createComment(commentData);
      setComments([...comments, newCommentResponse]);
      setNewComment("");

      // 댓글 수 업데이트
      setPost({
        ...post,
        comments_count: post.comments_count + 1,
      });
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await ForumAPI.deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));

      // 댓글 수 업데이트
      if (post) {
        setPost({
          ...post,
          comments_count: Math.max(0, post.comments_count - 1),
        });
      }
    } catch (error) {
      showToast("댓글 삭제에 실패했습니다.", "error");
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-700 text-xl">로딩 중...</div>
        </div>
      </PageLayout>
    );
  }

  if (error || (!loading && !post)) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-700 text-xl">
            {error || "게시글을 찾을 수 없습니다."}
          </div>
        </div>
      </PageLayout>
    );
  }

  // post가 null이 아님을 보장
  if (!post) return null;

  return (
    <PageLayout className="p-4">
      <div className="space-y-4">
        {/* 상단 버튼들 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            목록으로 돌아가기
          </button>

          {/* 어드민 삭제 버튼 */}
          {isAdmin && (
            <button
              onClick={handleAdminDelete}
              className="flex items-center text-red-600 hover:text-red-800 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              관리자 삭제
            </button>
          )}
        </div>

        {/* 게시글 내용 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          {/* 카테고리 */}
          <div className="mb-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {post.category === "free"
                ? "자유"
                : post.category === "trolley"
                  ? "트롤리 딜레마"
                  : post.category === "brain_vat"
                    ? "통 속의 뇌"
                    : post.category === "prisoner"
                      ? "죄수의 딜레마"
                      : "테세우스의 배"}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between text-gray-500 text-sm mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="font-medium">
                {post.author?.username || "비회원"}
              </span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>조회 {post.views_count}</span>
              <span>댓글 {post.comments_count}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="text-gray-700 mb-6 leading-relaxed">
            {post.content}
          </div>

          {/* 좋아요 버튼 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                !isAuthenticated
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={!isAuthenticated ? "로그인이 필요합니다" : undefined}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likes_count}</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            댓글 ({comments.length})
          </h2>

          {/* 댓글 작성 폼 */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 border border-gray-200 focus:border-blue-400 focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  댓글 작성
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                댓글을 작성하려면 로그인이 필요합니다.
              </p>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {comment.author?.username || "비회원"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {/* 본인 댓글인 경우 삭제 버튼 표시 */}
                    {user && comment.author_id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="댓글 삭제"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{comment.likes_count || 0}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
