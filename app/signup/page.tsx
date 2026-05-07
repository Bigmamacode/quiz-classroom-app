import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="dashboard-grid">
      <AuthForm mode="signup" />
      <section className="card">
        <p className="eyebrow">Uso in classe</p>
        <h2>Account studente</h2>
        <p>Ogni nuovo iscritto entra come studente. Il ruolo admin viene assegnato dal docente direttamente in Supabase.</p>
        <p className="helper-text">Hai già un account? <Link href="/login">Vai al login</Link>.</p>
      </section>
    </div>
  );
}
