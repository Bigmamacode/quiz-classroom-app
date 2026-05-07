import { aggregateQuestionErrors, aggregateStudentRanking } from "@/lib/quiz";
import { unstable_noStore as noStore } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { QuizRow } from "@/types/database";

export default async function AdminStatsPage() {
  noStore();
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: questions }, { data: attempts }, { data: sessions }] = await Promise.all([
    supabase.from("quiz").select("*"),
    supabase.from("tentativi").select("id,quiz_id,user_id,corretta,timestamp"),
    supabase.from("quiz_sessions").select("id,user_id,materia,started_at,completed_at,total_questions,correct_answers,percentage,profiles(full_name,email)")
  ]);

  const questionStats = aggregateQuestionErrors((questions as QuizRow[] | null) ?? [], (attempts as any[] | null) ?? []);
  const ranking = aggregateStudentRanking((sessions as any[] | null) ?? []);

  return (
    <div className="summary-list">
      <section className="card table-card">
        <p className="eyebrow">Errori per domanda</p>
        <h2>Domande più difficili</h2>
        <table>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Argomento</th>
              <th>Domanda</th>
              <th>Tentativi</th>
              <th>Errori %</th>
            </tr>
          </thead>
          <tbody>
            {questionStats.slice(0, 20).map((row) => (
              <tr key={row.id}>
                <td>{row.materia}</td>
                <td>{row.argomento}</td>
                <td>{row.domanda}</td>
                <td>{row.attempts}</td>
                <td>{row.errorRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card table-card">
        <p className="eyebrow">Ranking studenti</p>
        <h2>Media percentuale</h2>
        <table>
          <thead>
            <tr>
              <th>Studente</th>
              <th>Quiz svolti</th>
              <th>Media</th>
              <th>Best</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((row) => (
              <tr key={row.userId}>
                <td>{row.name}</td>
                <td>{row.sessions}</td>
                <td>{row.average}%</td>
                <td>{row.best}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
