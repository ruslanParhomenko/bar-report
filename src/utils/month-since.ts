export function monthsSince(dateString: string | null | undefined) {
  if (!dateString) return null;
  const start = new Date(dateString);
  const now = new Date();

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  const dayDiff = now.getDate() - start.getDate();
  months += dayDiff / 30.44;
  return Math.round(months);
}
