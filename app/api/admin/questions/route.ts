import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const body = await request.json();

  const payload = {
    materia: String(body.materia || ""),
    argomento: String(body.argomento || ""),
    domanda: String(body.domanda || ""),
    A: String(body.A || ""),
    B: String(body.B || ""),
    C: String(body.C || ""),
    D: String(body.D || ""),
    E: String(body.E || ""),
    corretta: String(body.corretta || ""),
    spiegazione: String(body.spiegazione || ""),
    difficolta: Number(body.difficolta || 1),
    created_by: admin.id
  };

  const { error } = await supabase.from("quiz").insert(payload);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
