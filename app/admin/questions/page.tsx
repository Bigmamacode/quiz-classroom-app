import { AdminQuestionForm } from "@/components/admin-question-form";
import { AdminQuestionTable } from "@/components/admin-question-table";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuizRow } from "@/types/database";

export default async function AdminQuestionsPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("quiz").select("*").order("created_at", { ascending: false }).limit(100);

  return (
    <div className="summary-list">
      <section>
        <p className="eyebrow">Admin</p>
        <h1>Nuova domanda</h1>
        <AdminQuestionForm />
      </section>
      <section>
        <p className="eyebrow">Archivio</p>
        <h2>Ultime 100 domande</h2>
        <AdminQuestionTable questions={(data as QuizRow[] | null) ?? []} />
      </section>
    </div>
  );
}
