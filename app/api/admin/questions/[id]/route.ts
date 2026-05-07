import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const body = await request.json();
  const { id } = await params;

  const { error } = await supabase
    .from("quiz")
    .update({
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
      difficolta: Number(body.difficolta || 1)
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { id } = await params;

  const { error } = await supabase.from("quiz").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
