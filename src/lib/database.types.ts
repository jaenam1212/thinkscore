export interface Profile {
  id: string;
  display_name?: string;
  created_at: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  evaluation_criteria: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Answer {
  id: number;
  user_id: string;
  question_id: number;
  content: string;
  created_at: string;
  questions?: Question;
  profiles?: Profile;
  scores?: Score[];
}

export interface Score {
  id: number;
  answer_id: number;
  score: number;
  reason?: string;
  created_at: string;
  answers?: Answer;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author_id: string;
  category: string;
  views_count: number;
  likes_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  comments?: ForumComment[];
  comments_count?: number;
}

export interface ForumComment {
  id: number;
  post_id: number;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface ForumLike {
  id: number;
  post_id: number;
  user_id: string;
  created_at: string;
}
