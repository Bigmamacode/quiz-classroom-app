import { NextResponse } from "next/server";
import { aggregateQuestionErrors, aggregateStudentRanking } from "@/lib/quiz";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QuizRow } from "@/types/database";

export async function GET() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: questions }, { data: attempts }, { data: sessions }] = await Promise.all([
    supabase.from("quiz").select("*"),
    supabase.from("tentativi").select("id,quiz_id,user_id,corretta,timestamp"),
    supabase.from("quiz_sessions").select("id,user_id,materia,started_at,completed_at,total_questions,correct_answers,percentage,profiles(full_name,email)")
  ]);

  return NextResponse.json({
    questionErrors: aggregateQuestionErrors((questions as QuizRow[] | null) ?? [], (attempts as any[] | null) ?? []),
    ranking: aggregateStudentRanking((sessions as any[] | null) ?? [])
  });
}
