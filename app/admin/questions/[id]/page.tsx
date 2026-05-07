import { notFound } from "next/navigation";
import { AdminQuestionForm } from "@/components/admin-question-form";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuizRow } from "@/types/database";

export default async function AdminQuestionEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("quiz").select("*").eq("id", id).maybeSingle();
  if (!data) {
    notFound();
  }

  return (
    <section>
      <p className="eyebrow">Admin</p>
      <h1>Modifica domanda</h1>
      <AdminQuestionForm quizId={id} initialValue={data as QuizRow} />
    </section>
  );
}
