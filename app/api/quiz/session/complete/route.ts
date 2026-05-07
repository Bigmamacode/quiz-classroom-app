import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { computePercentage } from "@/lib/quiz";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();
  const body = await request.json();

  const totalQuestions = Number(body.totalQuestions || 0);
  const correctAnswers = Number(body.correctAnswers || 0);
  const percentage = computePercentage(correctAnswers, totalQuestions);

  const { error } = await supabase
    .from("quiz_sessions")
    .update({
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      percentage,
      completed_at: new Date().toISOString()
    })
    .eq("id", String(body.sessionId || ""))
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, percentage });
}
