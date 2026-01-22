import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-revalidate-secret");
    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { tag } = await req.json();
    if (!tag) return new Response("Missing tag", { status: 400 });

    revalidateTag(tag, "max");

    return new Response(JSON.stringify({ ok: true, tag }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
