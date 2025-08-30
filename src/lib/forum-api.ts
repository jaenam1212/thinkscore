import { apiClient } from "./api";

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
    avatar_url?: string;
  };
  comments_count: number;
  likes_count: number;
  views_count: number;
  created_at: string;
  category: string;
  is_pinned?: boolean;
  comments?: ForumComment[];
}

export interface ForumComment {
  id: number;
  content: string;
  author: {
    username: string;
    avatar_url?: string;
  };
  created_at: string;
  likes_count: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  category?: string;
  question_id?: number;
}

export interface ForumBoard {
  id: number | null;
  name: string;
  type: "general" | "question";
  description?: string;
  published_at?: string;
}

export interface CreateCommentData {
  post_id: number;
  content: string;
}

export class ForumAPI {
  // 게시판 목록 조회
  static async getBoards(): Promise<ForumBoard[]> {
    return apiClient.get<ForumBoard[]>("/forum/boards");
  }

  // 게시글 목록 조회 (새 API)
  static async getPosts(
    questionId?: number,
    sort?: "recent" | "popular" | "all"
  ): Promise<ForumPost[]> {
    const params = new URLSearchParams();
    if (questionId) params.append("question_id", questionId.toString());
    if (sort && sort !== "all") params.append("sort", sort);

    const queryString = params.toString();
    const endpoint = `/forum/posts${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<ForumPost[]>(endpoint);
  }

  // 호환성을 위한 구 API (삭제 예정)
  static async getPostsByCategory(
    category?: string,
    sort?: "recent" | "popular" | "all"
  ): Promise<ForumPost[]> {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (sort && sort !== "all") params.append("sort", sort);

    const queryString = params.toString();
    const endpoint = `/forum/posts${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<ForumPost[]>(endpoint);
  }

  // 게시글 상세 조회
  static async getPost(id: number): Promise<ForumPost> {
    return apiClient.get<ForumPost>(`/forum/posts/${id}`);
  }

  // 게시글 작성
  static async createPost(data: CreatePostData): Promise<ForumPost> {
    return apiClient.post<ForumPost, CreatePostData>("/forum/posts", data);
  }

  // 게시글 수정
  static async updatePost(
    id: number,
    data: Partial<CreatePostData>
  ): Promise<ForumPost> {
    return apiClient.put<ForumPost, Partial<CreatePostData>>(
      `/forum/posts/${id}`,
      data
    );
  }

  // 게시글 삭제
  static async deletePost(id: number): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/forum/posts/${id}`);
  }

  // 댓글 목록 조회
  static async getComments(postId: number): Promise<ForumComment[]> {
    return apiClient.get<ForumComment[]>(`/forum/posts/${postId}/comments`);
  }

  // 댓글 작성
  static async createComment(data: CreateCommentData): Promise<ForumComment> {
    return apiClient.post<ForumComment, CreateCommentData>(
      "/forum/comments",
      data
    );
  }

  // 좋아요/취소
  static async toggleLike(postId: number): Promise<{ liked: boolean }> {
    return apiClient.post<{ liked: boolean }, Record<string, never>>(
      `/forum/posts/${postId}/like`,
      {}
    );
  }

  // 좋아요 상태 확인
  static async getLikeStatus(postId: number): Promise<{ liked: boolean }> {
    return apiClient.get<{ liked: boolean }>(
      `/forum/posts/${postId}/like-status`
    );
  }

  // 어드민: 게시글 삭제
  static async adminDeletePost(postId: number): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(
      `/forum/admin/posts/${postId}`
    );
  }

  // 어드민 상태 확인
  static async checkAdminStatus(): Promise<{ isAdmin: boolean }> {
    return apiClient.get<{ isAdmin: boolean }>("/forum/admin/check");
  }
}
