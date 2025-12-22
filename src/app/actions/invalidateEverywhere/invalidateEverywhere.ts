"use server";

export async function invalidateEverywhere(tag: string) {
  // updateTag(tag);

  const endpoints = [
    "https://report-bar-n.netlify.app/api/revalidate",
    // "https://bar-report2.vercel.app/api/revalidate",
    "https://bar-report-rus.vercel.app/api/revalidate",
    "https://schedule-nuovo.vercel.app/api/revalidate",
  ];

  await Promise.allSettled(
    endpoints.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
      })
    )
  );
}
