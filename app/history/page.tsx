import { unstable_noStore as noStore } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  noStore();
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: sessions } = await supabase
    .from("quiz_sessions")
    .select(`
      id,
      materia,
      started_at,
      completed_at,
      total_questions,
      correct_answers,
      percentage,
      tentativi (
        id,
        risposta_data,
        corretta,
        timestamp,
        quiz (
          domanda,
          corretta,
          spiegazione,
          argomento
        )
      )
    `)
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });

  return (
    <section className="card">
      <p className="eyebrow">Storico risultati</p>
      <h1>Tutti i tentativi</h1>
      {!sessions?.length ? (
        <p className="helper-text">Nessun quiz completato.</p>
      ) : (
        <div className="summary-list">
          {sessions.map((session: any) => (
            <article className="summary-item" key={session.id}>
              <h3>{session.materia}</h3>
              <p>{session.correct_answers}/{session.total_questions} corrette - {session.percentage}%</p>
              <div className="summary-list">
                {session.tentativi.map((attempt: any) => (
                  <div key={attempt.id} className="feedback-box">
                    <strong>{attempt.quiz?.domanda}</strong>
                    <p className={attempt.corretta ? "positive" : "negative"}>
                      {attempt.corretta ? "Corretto" : `Errato - tua risposta ${attempt.risposta_data}, corretta ${attempt.quiz?.corretta}`}
                    </p>
                    <p>{attempt.quiz?.spiegazione}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
