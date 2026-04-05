"use server";

function parseBnmXml(xml: string): number | null {
  const regex = new RegExp(
    `<CharCode>USD</CharCode>[\\s\\S]*?<Value>([\\d,.]+)</Value>`,
  );

  const match = xml.match(regex);
  if (!match) return null;

  return Number(match[1].replace(",", "."));
}

export async function getTodayUSDRateBNM(): Promise<number> {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const date = `${day}.${month}.${year}`;

  const res = await fetch(
    `https://www.bnm.md/ru/official_exchange_rates?get_xml=1&date=${date}`,
    {
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch BNM EUR rate");
  }

  const xml = await res.text();
  const rate = parseBnmXml(xml);

  if (!rate) {
    throw new Error("rate not found in BNM response");
  }

  return Number(rate.toFixed(4));
}
