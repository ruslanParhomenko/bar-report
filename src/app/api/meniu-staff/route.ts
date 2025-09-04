import { NextResponse } from "next/server";
import { supabaseStaff } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabaseStaff
      .from("meniu_staff_realtime")
      .select("form_data,user_email");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (!body.user_email) {
//       return NextResponse.json(
//         { error: "user_email is required" },
//         { status: 400 }
//       );
//     }

//     const { error } = await supabase.from("meniu_staff_realtime").upsert(
//       {
//         user_email: body.user_email,
//         form_data: body.form_data,
//       },
//       { onConflict: "user_email" }
//     );

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
