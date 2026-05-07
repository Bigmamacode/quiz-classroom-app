"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("full_name") || "");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "student"
          }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Registrazione completata. Se hai conferma email attiva, verifica la casella.");
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <form className="card form-stack" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">{mode === "signup" ? "Nuovo studente" : "Accesso"}</p>
        <h1>{mode === "signup" ? "Crea account" : "Bentornato"}</h1>
      </div>
      {mode === "signup" ? (
        <label>
          Nome e cognome
          <input name="full_name" placeholder="Mario Rossi" required />
        </label>
      ) : null}
      <label>
        Email
        <input name="email" type="email" placeholder="studente@scuola.it" required />
      </label>
      <label>
        Password
        <input name="password" type="password" placeholder="Minimo 6 caratteri" minLength={6} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Attendere..." : mode === "signup" ? "Registrati" : "Entra"}
      </button>
      {message ? <p className="helper-text">{message}</p> : null}
    </form>
  );
}
