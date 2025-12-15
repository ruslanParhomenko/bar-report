import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { mail, dataStopList } = await req.json();
    if (!mail || !dataStopList) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("stop_list_realtime")
      .upsert(
        { user_email: mail, form_data: dataStopList },
        { onConflict: "user_email" }
      );
    revalidateTag("stopList", "default");
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
