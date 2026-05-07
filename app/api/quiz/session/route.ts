import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      user_id: user.id,
      materia: String(body.materia || ""),
      total_questions: Number(body.totalQuestions || 0),
      correct_answers: 0,
      percentage: 0
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ sessionId: data.id });
}
