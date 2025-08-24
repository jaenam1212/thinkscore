import { ForumPost, ForumBoard } from "@/lib/forum-api";

interface ForumPostCardProps {
  post: ForumPost;
  currentBoard: ForumBoard | undefined;
  onClick: (postId: number) => void;
}

export default function ForumPostCard({
  post,
  currentBoard,
  onClick,
}: ForumPostCardProps) {
  return (
    <div
      onClick={() => onClick(post.id)}
      className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow"
    >
      {/* 게시판 정보 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {currentBoard?.name || "전체 포럼"}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* 제목 */}
      <h3 className="font-medium text-gray-900 mb-2 leading-tight">
        {post.title}
      </h3>

      {/* 내용 미리보기 */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>

      {/* 작성자 및 통계 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {post.author.username.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-gray-600">{post.author.username}</span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>{post.views_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>{post.comments_count}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="w-3 h-3"
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
            <span>{post.likes_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
