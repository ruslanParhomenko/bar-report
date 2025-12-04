import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const tag = await req.json();

    if (!tag) {
      return new Response("Missing tag", { status: 400 });
    }

    revalidateTag(tag, "default");
    return Response.json({ ok: true, tag });
  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
