"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { QuizRow } from "@/types/database";

export function AdminQuestionTable({ questions }: { questions: QuizRow[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Eliminare questa domanda?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    }
  }

  if (!questions.length) {
    return <div className="card">Nessuna domanda presente.</div>;
  }

  return (
    <div className="card table-card">
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Argomento</th>
            <th>Domanda</th>
            <th>Corretta</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.materia}</td>
              <td>{question.argomento}</td>
              <td>{question.domanda}</td>
              <td>{question.corretta}</td>
              <td className="action-cell">
                <Link className="ghost-button" href={`/admin/questions/${question.id}`}>Modifica</Link>
                <button className="danger-button" type="button" onClick={() => void handleDelete(question.id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
