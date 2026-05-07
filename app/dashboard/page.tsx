import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuizRow, QuizSessionRow } from "@/types/database";

export default async function DashboardPage() {
  noStore();
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const adminSupabase = createSupabaseAdminClient();

  const [{ data: questions }, { data: sessions }] = await Promise.all([
    adminSupabase.from("quiz").select("*").order("materia").order("argomento"),
    supabase
      .from("quiz_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(6)
  ]);

  const typedQuestions = (questions as QuizRow[] | null) ?? [];
  const typedSessions = (sessions as QuizSessionRow[] | null) ?? [];
  const subjects = Object.values(
    typedQuestions.reduce<Record<string, { materia: string; count: number; topics: Set<string> }>>((acc, item) => {
      if (!acc[item.materia]) {
        acc[item.materia] = {
          materia: item.materia,
          count: 0,
          topics: new Set<string>()
        };
      }
      acc[item.materia].count += 1;
      acc[item.materia].topics.add(item.argomento);
      return acc;
    }, {})
  );

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Area studente</p>
        <h1>Allenati per materia e monitora i progressi.</h1>
        <p>Ogni quiz mostra correzione immediata, spiegazione teorica e storico personale.</p>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span>Materie disponibili</span>
          <strong>{subjects.length}</strong>
        </article>
        <article className="metric-card">
          <span>Domande totali</span>
          <strong>{typedQuestions.length}</strong>
        </article>
        <article className="metric-card">
          <span>Quiz svolti</span>
          <strong>{typedSessions.length}</strong>
        </article>
        <article className="metric-card">
          <span>Ultima media</span>
          <strong>{typedSessions[0]?.percentage ?? 0}%</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="subject-grid">
          {subjects.map((subject) => (
            <article className="card subject-card" key={subject.materia}>
              <p className="eyebrow">{subject.topics.size} argomenti</p>
              <h2>{subject.materia}</h2>
              <p>{subject.count} domande disponibili.</p>
              <Link href={`/quiz/${encodeURIComponent(subject.materia)}`}>
                <button type="button">Inizia quiz</button>
              </Link>
            </article>
          ))}
        </div>

        <aside className="card">
          <p className="eyebrow">Storico recente</p>
          <h2>Ultimi tentativi</h2>
          {typedSessions.length ? (
            <div className="summary-list">
              {typedSessions.map((session) => (
                <article className="summary-item" key={session.id}>
                  <strong>{session.materia}</strong>
                  <p>{session.correct_answers}/{session.total_questions} corrette</p>
                  <p>{session.percentage}%</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="helper-text">Nessun quiz completato per ora.</p>
          )}
          <Link href="/history" className="ghost-button">Apri storico completo</Link>
        </aside>
      </section>
    </>
  );
}
