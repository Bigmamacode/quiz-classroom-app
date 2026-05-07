"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminUploadForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/import-csv", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();

    setMessage(response.ok ? `${payload.inserted} domande importate.` : payload.error || "Import fallito.");
    setUploading(false);
    router.refresh();
  }

  return (
    <form className="card form-stack" onSubmit={handleSubmit}>
      <label>
        File CSV
        <input name="file" type="file" accept=".csv,text/csv" required />
      </label>
      <button type="submit" disabled={uploading}>{uploading ? "Upload..." : "Importa quiz"}</button>
      <p className="helper-text">Formato richiesto: materia,argomento,domanda,A,B,C,D,E,corretta,spiegazione,difficolta</p>
      {message ? <p className="helper-text">{message}</p> : null}
    </form>
  );
}
