import { apiClient } from "./api";
import {
  Profile,
  Question,
  Answer,
  Score,
  ForumPost,
  ForumComment,
} from "./database.types";

interface CreateProfileData {
  id: string;
  display_name?: string;
}

interface UpdateProfileData {
  display_name?: string;
}

interface CreateQuestionData {
  prompt: string;
  is_active?: boolean;
}

interface UpdateQuestionData {
  prompt?: string;
  is_active?: boolean;
}

interface CreateAnswerData {
  user_id?: string;
  question_id: number;
  content: string;
  is_anonymous?: boolean;
}

interface CreateScoreData {
  answer_id: number;
  score: number;
  reason?: string;
}

export const profileService = {
  getProfile: (id: string): Promise<Profile> =>
    apiClient.get<Profile>(`/profiles/${id}`),

  createProfile: (data: CreateProfileData): Promise<Profile> =>
    apiClient.post<Profile, CreateProfileData>("/profiles", data),

  updateProfile: (id: string, data: UpdateProfileData): Promise<Profile> =>
    apiClient.put<Profile, UpdateProfileData>(`/profiles/${id}`, data),
};

export const questionService = {
  getActiveQuestions: (): Promise<Question[]> =>
    apiClient.get<Question[]>("/questions"),

  getQuestion: (id: number): Promise<Question> =>
    apiClient.get<Question>(`/questions/${id}`),

  createQuestion: (data: CreateQuestionData): Promise<Question> =>
    apiClient.post<Question, CreateQuestionData>("/questions", data),

  updateQuestion: (id: number, data: UpdateQuestionData): Promise<Question> =>
    apiClient.put<Question, UpdateQuestionData>(`/questions/${id}`, data),

  seedQuestions: (): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>("/questions/seed", {}),

  getTodaysQuestion: (): Promise<Question> =>
    apiClient.get<Question>("/questions/today"),

  getRandomQuestion: (): Promise<Question> =>
    apiClient.get<Question>("/questions/random"),

  getQuestionsList: (): Promise<
    Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      difficulty: string;
      tags: string[];
    }>
  > =>
    apiClient.get<
      Array<{
        id: number;
        title: string;
        description: string;
        category: string;
        difficulty: string;
        tags: string[];
      }>
    >("/questions/list"),
};

export const answerService = {
  getUserAnswers: (userId: string): Promise<Answer[]> =>
    apiClient.get<Answer[]>(`/answers/user/${userId}`),

  getQuestionAnswers: (questionId: number): Promise<Answer[]> =>
    apiClient.get<Answer[]>(`/answers/question/${questionId}`),

  getAnswer: (id: number): Promise<Answer> =>
    apiClient.get<Answer>(`/answers/${id}`),

  createAnswer: (data: CreateAnswerData): Promise<Answer> =>
    apiClient.post<Answer, CreateAnswerData>("/answers", data),

  evaluateAnswer: (
    answerId: number
  ): Promise<{
    score: number;
    feedback: string;
    criteriaScores: Record<string, number>;
    scoreRecord?: Score;
  }> => apiClient.post(`/answers/${answerId}/evaluate`, {}),
};

export const scoreService = {
  getAnswerScores: (answerId: number): Promise<Score[]> =>
    apiClient.get<Score[]>(`/scores/answer/${answerId}`),

  getUserScores: (userId: string): Promise<Score[]> =>
    apiClient.get<Score[]>(`/scores/user/${userId}`),

  getScore: (id: number): Promise<Score> =>
    apiClient.get<Score>(`/scores/${id}`),

  createScore: (data: CreateScoreData): Promise<Score> =>
    apiClient.post<Score, CreateScoreData>("/scores", data),
};

// Forum interfaces
interface CreateForumPostData {
  title: string;
  content: string;
  category?: string;
}

interface UpdateForumPostData {
  title?: string;
  content?: string;
  category?: string;
}

interface CreateCommentData {
  content: string;
}

export const forumService = {
  // Posts
  getAllPosts: (): Promise<ForumPost[]> =>
    apiClient.get<ForumPost[]>("/forum/posts"),

  getPost: (id: number): Promise<ForumPost> =>
    apiClient.get<ForumPost>(`/forum/posts/${id}`),

  createPost: (data: CreateForumPostData): Promise<ForumPost> =>
    apiClient.post<ForumPost, CreateForumPostData>("/forum/posts", data),

  updatePost: (id: number, data: UpdateForumPostData): Promise<ForumPost> =>
    apiClient.put<ForumPost, UpdateForumPostData>(`/forum/posts/${id}`, data),

  deletePost: (id: number): Promise<void> =>
    apiClient.delete(`/forum/posts/${id}`),

  likePost: (id: number): Promise<void> =>
    apiClient.post(`/forum/posts/${id}/like`, {}),

  unlikePost: (id: number): Promise<void> =>
    apiClient.delete(`/forum/posts/${id}/like`),

  // Comments
  getPostComments: (postId: number): Promise<ForumComment[]> =>
    apiClient.get<ForumComment[]>(`/forum/posts/${postId}/comments`),

  createComment: (
    postId: number,
    data: CreateCommentData
  ): Promise<ForumComment> =>
    apiClient.post<ForumComment, CreateCommentData>(
      `/forum/posts/${postId}/comments`,
      data
    ),

  updateComment: (id: number, data: CreateCommentData): Promise<ForumComment> =>
    apiClient.put<ForumComment, CreateCommentData>(
      `/forum/comments/${id}`,
      data
    ),

  deleteComment: (id: number): Promise<void> =>
    apiClient.delete(`/forum/comments/${id}`),
};
