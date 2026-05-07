import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  noStore();
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: questions }, { data: attempts }, { data: sessions }] = await Promise.all([
    supabase.from("quiz").select("id"),
    supabase.from("tentativi").select("id"),
    supabase.from("quiz_sessions").select("id")
  ]);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Area docente</p>
        <h1>Gestisci domande, import CSV e statistiche di classe.</h1>
        <p>Accesso protetto con ruolo admin e policy RLS lato Supabase.</p>
      </section>

      <section className="metric-grid">
        <article className="metric-card"><span>Domande</span><strong>{questions?.length ?? 0}</strong></article>
        <article className="metric-card"><span>Risposte raccolte</span><strong>{attempts?.length ?? 0}</strong></article>
        <article className="metric-card"><span>Quiz completati</span><strong>{sessions?.length ?? 0}</strong></article>
        <article className="metric-card"><span>Azioni rapide</span><strong>3</strong></article>
      </section>

      <section className="subject-grid">
        <article className="card subject-card">
          <h2>Gestione domande</h2>
          <p>Crea, modifica ed elimina quesiti.</p>
          <Link href="/admin/questions"><button type="button">Apri CRUD</button></Link>
        </article>
        <article className="card subject-card">
          <h2>Import CSV</h2>
          <p>Carica un file in formato strutturato.</p>
          <Link href="/admin/upload"><button type="button">Carica CSV</button></Link>
        </article>
        <article className="card subject-card">
          <h2>Statistiche</h2>
          <p>Errori per domanda, ranking studenti e progressi.</p>
          <Link href="/admin/stats"><button type="button">Apri dashboard</button></Link>
        </article>
      </section>
    </>
  );
}
