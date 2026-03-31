export const runtime = "nodejs";

import { bot } from "@/lib/telegraf/bot";

export async function POST(req: Request) {
  try {
    const update = await req.json();
    await bot.handleUpdate(update);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("TELEGRAM ERROR:", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
