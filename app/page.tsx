import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect(profile.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <section className="hero">
      <p className="eyebrow">Next.js + Supabase</p>
      <h1>Quiz scolastici con correzione automatica e dashboard docente.</h1>
      <p>
        Gli studenti rispondono una domanda alla volta, ricevono feedback immediato e consultano lo storico.
        Il docente gestisce domande, CSV e statistiche.
      </p>
      <div className="action-row">
        <Link href="/signup"><button type="button">Crea account studente</button></Link>
        <Link href="/login" className="ghost-button">Accedi</Link>
      </div>
    </section>
  );
}
