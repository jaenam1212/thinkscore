import { apiClient } from "./api";

export interface RankingUser {
  id: string;
  username: string;
  display_name: string;
  total_score: number;
  average_score: number;
  answer_count: number;
  rank_position: number;
}

export interface QuestionRankingUser {
  id: string;
  username: string;
  display_name: string;
  question_score: number;
  question_answer_count: number;
  total_score: number;
  rank_position: number;
}

export interface UserRank {
  rank_position: number;
  total_users: number;
  user_score: number;
  percentile: number;
}

export interface RankingStats {
  total_users: number;
  total_answers: number;
  average_score: number;
  top_scorer_name: string;
  top_score: number;
}

export class RankingAPI {
  // 종합 랭킹 조회
  static async getOverallRankings(limit: number = 50): Promise<RankingUser[]> {
    return apiClient.get<RankingUser[]>(`/rankings/overall?limit=${limit}`);
  }

  // 문제별 랭킹 조회
  static async getQuestionRankings(
    questionId: number,
    limit: number = 50
  ): Promise<QuestionRankingUser[]> {
    return apiClient.get<QuestionRankingUser[]>(
      `/rankings/question/${questionId}?limit=${limit}`
    );
  }

  // 내 종합 순위 조회
  static async getMyOverallRank(): Promise<UserRank> {
    return apiClient.get<UserRank>("/rankings/my-rank/overall");
  }

  // 내 문제별 순위 조회
  static async getMyQuestionRank(questionId: number): Promise<UserRank> {
    return apiClient.get<UserRank>(`/rankings/my-rank/question/${questionId}`);
  }

  // 랭킹 통계
  static async getRankingStats(): Promise<RankingStats> {
    return apiClient.get<RankingStats>("/rankings/stats");
  }
}
