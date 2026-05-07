import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { QuizRunner } from "@/components/quiz-runner";
import { requireUser } from "@/lib/auth";
import { shuffleQuestions } from "@/lib/quiz";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QuizRow } from "@/types/database";

export default async function QuizPage({ params }: { params: Promise<{ materia: string }> }) {
  noStore();
  await requireUser();
  const { materia } = await params;
  const decodedMateria = decodeURIComponent(materia);
  const supabase = createSupabaseAdminClient();

  const { data } = await supabase
    .from("quiz")
    .select("*")
    .eq("materia", decodedMateria)
    .order("difficolta", { ascending: true });

  const questions = shuffleQuestions((data as QuizRow[] | null) ?? []).slice(0, 10);
  if (!questions.length) {
    notFound();
  }

  return <QuizRunner questions={questions} materia={decodedMateria} />;
}
