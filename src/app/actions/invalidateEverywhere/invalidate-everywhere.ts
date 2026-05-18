"use server";

export async function invalidateEverywhere(tag: string) {
  const url = "https://schedule-nuovo.vercel.app/api/revalidate";

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
    },
    body: JSON.stringify({ tag }),
  }).catch(() => {});
}
