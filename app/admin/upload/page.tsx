import { AdminUploadForm } from "@/components/admin-upload-form";
import { requireAdmin } from "@/lib/auth";

export default async function AdminUploadPage() {
  await requireAdmin();

  return (
    <section className="summary-list">
      <div>
        <p className="eyebrow">Import CSV</p>
        <h1>Caricamento massivo quiz</h1>
        <p className="helper-text">Il file deve contenere: materia,argomento,domanda,A,B,C,D,E,corretta,spiegazione,difficolta</p>
      </div>
      <AdminUploadForm />
    </section>
  );
}
