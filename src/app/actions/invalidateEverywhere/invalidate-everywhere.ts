"use server";

export async function invalidateEverywhere(tag: string) {
  const endpoints = ["https://schedule-nuovo.vercel.app/api/revalidate"];

  await Promise.allSettled(
    endpoints.map((url) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
        },
        body: JSON.stringify({ tag }),
      }),
    ),
  );
}
