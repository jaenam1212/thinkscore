const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // localStorage에서 토큰 가져오기
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T, D = unknown>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // 답변 관련 메서드
  async getUserAnswerForQuestion(
    userId: string,
    questionId: number
  ): Promise<UserAnswer | null> {
    const answers = await this.get<UserAnswer[]>(
      `/answers/question/${questionId}`
    );
    return answers.find((answer) => answer.user_id === userId) || null;
  }

  async getAnswerWithScore(answerId: number): Promise<UserAnswer> {
    return this.get<UserAnswer>(`/answers/${answerId}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
