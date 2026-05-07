"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { QuizRow } from "@/types/database";

const EMPTY_FORM = {
  materia: "",
  argomento: "",
  domanda: "",
  A: "",
  B: "",
  C: "",
  D: "",
  E: "",
  corretta: "A",
  spiegazione: "",
  difficolta: 1
};

export function AdminQuestionForm({
  initialValue,
  quizId
}: {
  initialValue?: Partial<QuizRow>;
  quizId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValue });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch(quizId ? `/api/admin/questions/${quizId}` : "/api/admin/questions", {
      method: quizId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.error || "Salvataggio non riuscito.");
    } else {
      setMessage(quizId ? "Domanda aggiornata." : "Domanda inserita.");
      if (!quizId) {
        setForm(EMPTY_FORM);
      }
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <form className="card form-grid dense-grid" onSubmit={handleSubmit}>
      <label>
        Materia
        <input value={form.materia} onChange={(e) => setForm((v) => ({ ...v, materia: e.target.value }))} required />
      </label>
      <label>
        Argomento
        <input value={form.argomento} onChange={(e) => setForm((v) => ({ ...v, argomento: e.target.value }))} required />
      </label>
      <label>
        Difficoltà
        <input
          type="number"
          min={1}
          max={5}
          value={form.difficolta}
          onChange={(e) => setForm((v) => ({ ...v, difficolta: Number(e.target.value) }))}
          required
        />
      </label>
      <label className="full-span">
        Domanda
        <textarea value={form.domanda} onChange={(e) => setForm((v) => ({ ...v, domanda: e.target.value }))} required />
      </label>
      {(["A", "B", "C", "D", "E"] as const).map((key) => (
        <label key={key}>
          Opzione {key}
          <input
            value={form[key]}
            onChange={(e) => setForm((v) => ({ ...v, [key]: e.target.value }))}
            required
          />
        </label>
      ))}
      <label>
        Risposta corretta
        <select value={form.corretta} onChange={(e) => setForm((v) => ({ ...v, corretta: e.target.value as QuizRow["corretta"] }))}>
          {["A", "B", "C", "D", "E"].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="full-span">
        Spiegazione teorica
        <textarea value={form.spiegazione} onChange={(e) => setForm((v) => ({ ...v, spiegazione: e.target.value }))} required />
      </label>
      <div className="full-span form-actions">
        <button type="submit" disabled={saving}>{saving ? "Salvataggio..." : quizId ? "Aggiorna domanda" : "Crea domanda"}</button>
        {message ? <p className="helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
