import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const { secret, tag } = await req.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!tag) {
      return new Response("Missing tag", { status: 400 });
    }

    revalidateTag(tag);
    return Response.json({ ok: true, tag });
  } catch (error) {
    console.error("Revalidate error:", error);
    return new Response("Error", { status: 500 });
  }
}
