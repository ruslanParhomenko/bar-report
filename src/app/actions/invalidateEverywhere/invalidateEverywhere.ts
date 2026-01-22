"use server";

export async function invalidateEverywhere(tag: string) {
  const endpoints = [
    "https://report-bar-n.netlify.app/api/revalidate",
    "https://bar-report-rus.vercel.app/api/revalidate",
    "https://schedule-nuovo.vercel.app/api/revalidate",
    "https://card-tech.netlify.app/api/revalidate",
    "http://localhost:3000/api/revalidate",
  ];

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
