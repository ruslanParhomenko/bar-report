import { fetchRealTime } from "@/lib/fetchRealTime";
import { supabase } from "@/lib/supabaseClient";

import { NextResponse } from "next/server";

export async function GET() {
  const data = await fetchRealTime("break_list_realtime");

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.user_email) {
    return NextResponse.json(
      { error: "user_email is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("break_list_realtime").upsert(
    {
      user_email: body.user_email,
      form_data: body.form_data,
    },
    { onConflict: "user_email" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
