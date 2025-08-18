export interface Profile {
  id: string;
  display_name?: string;
  created_at: string;
}

export interface Question {
  id: number;
  prompt: string;
  is_active: boolean;
  created_at: string;
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
