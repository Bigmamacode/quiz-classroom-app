import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="dashboard-grid">
      <AuthForm mode="login" />
      <section className="card">
        <p className="eyebrow">Studenti e docenti</p>
        <h2>Accesso protetto</h2>
        <p>Gli studenti vedono quiz e storico personale. I docenti vedono gestione domande, import CSV e statistiche.</p>
        <p className="helper-text">Non hai ancora un account? <Link href="/signup">Registrati qui</Link>.</p>
      </section>
    </div>
  );
}
