import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();
  const body = await request.json();

  const { data: quiz, error: quizError } = await supabase
    .from("quiz")
    .select("id,corretta")
    .eq("id", String(body.quizId || ""))
    .single();

  if (quizError || !quiz) {
    return NextResponse.json({ error: quizError?.message || "Quiz non trovato." }, { status: 404 });
  }

  const given = String(body.answer || "");
  const correct = quiz.corretta === given;
  const { error } = await supabase.from("tentativi").insert({
    session_id: String(body.sessionId || ""),
    user_id: user.id,
    quiz_id: quiz.id,
    risposta_data: given,
    corretta: correct
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ correct });
}
