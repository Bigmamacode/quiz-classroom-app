export type UserRole = "student" | "admin";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface QuizRow {
  id: string;
  materia: string;
  argomento: string;
  domanda: string;
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  corretta: "A" | "B" | "C" | "D" | "E";
  spiegazione: string;
  difficolta: number;
  created_at?: string;
  created_by?: string | null;
}

export interface QuizSessionRow {
  id: string;
  user_id: string;
  materia: string;
  started_at: string;
  completed_at: string | null;
  total_questions: number;
  correct_answers: number;
  percentage: number;
}

export interface TentativoRow {
  id: string;
  session_id: string;
  user_id: string;
  quiz_id: string;
  risposta_data: "A" | "B" | "C" | "D" | "E";
  corretta: boolean;
  timestamp: string;
}
