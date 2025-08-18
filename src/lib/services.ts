import { apiClient } from './api';
import { Profile, Question, Answer, Score } from './database.types';

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
  user_id: string;
  question_id: number;
  content: string;
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
    apiClient.post<Profile, CreateProfileData>('/profiles', data),
  
  updateProfile: (id: string, data: UpdateProfileData): Promise<Profile> =>
    apiClient.put<Profile, UpdateProfileData>(`/profiles/${id}`, data),
};

export const questionService = {
  getActiveQuestions: (): Promise<Question[]> =>
    apiClient.get<Question[]>('/questions'),
  
  getQuestion: (id: number): Promise<Question> =>
    apiClient.get<Question>(`/questions/${id}`),
  
  createQuestion: (data: CreateQuestionData): Promise<Question> =>
    apiClient.post<Question, CreateQuestionData>('/questions', data),
  
  updateQuestion: (id: number, data: UpdateQuestionData): Promise<Question> =>
    apiClient.put<Question, UpdateQuestionData>(`/questions/${id}`, data),
};

export const answerService = {
  getUserAnswers: (userId: string): Promise<Answer[]> =>
    apiClient.get<Answer[]>(`/answers/user/${userId}`),
  
  getQuestionAnswers: (questionId: number): Promise<Answer[]> =>
    apiClient.get<Answer[]>(`/answers/question/${questionId}`),
  
  getAnswer: (id: number): Promise<Answer> =>
    apiClient.get<Answer>(`/answers/${id}`),
  
  createAnswer: (data: CreateAnswerData): Promise<Answer> =>
    apiClient.post<Answer, CreateAnswerData>('/answers', data),
};

export const scoreService = {
  getAnswerScores: (answerId: number): Promise<Score[]> =>
    apiClient.get<Score[]>(`/scores/answer/${answerId}`),
  
  getUserScores: (userId: string): Promise<Score[]> =>
    apiClient.get<Score[]>(`/scores/user/${userId}`),
  
  getScore: (id: number): Promise<Score> =>
    apiClient.get<Score>(`/scores/${id}`),
  
  createScore: (data: CreateScoreData): Promise<Score> =>
    apiClient.post<Score, CreateScoreData>('/scores', data),
};