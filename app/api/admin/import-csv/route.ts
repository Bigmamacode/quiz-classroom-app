import Papa from "papaparse";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File CSV mancante." }, { status: 400 });
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors.length) {
    return NextResponse.json({ error: parsed.errors[0].message }, { status: 400 });
  }

  const rows = parsed.data.map((row) => ({
    materia: row.materia?.trim() || "",
    argomento: row.argomento?.trim() || "",
    domanda: row.domanda?.trim() || "",
    A: row.A?.trim() || "",
    B: row.B?.trim() || "",
    C: row.C?.trim() || "",
    D: row.D?.trim() || "",
    E: row.E?.trim() || "",
    corretta: row.corretta?.trim() || "",
    spiegazione: row.spiegazione?.trim() || "",
    difficolta: Number(row.difficolta || 1),
    created_by: admin.id
  }));

  const { error } = await supabase.from("quiz").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ inserted: rows.length });
}
