"use server";

export async function invalidateEverywhere(tag: string) {
  const urls = [
    "https://swap-2106.vercel.app//api/revalidate",
    "https://menu-vip.vercel.app/api/revalidate",
    "https://swap-2012.netlify.app/api/revalidate",
    "https://report-staff.netlify.app/api/revalidate",
  ];

  await Promise.all(
    urls.map((url) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": process.env.REVALIDATE_SECRET!,
        },
        body: JSON.stringify({ tag }),
      }).catch(() => {}),
    ),
  );
}
