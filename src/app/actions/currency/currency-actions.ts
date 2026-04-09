"use server";

import { unstable_cache } from "next/cache";

function parseBnmXml(xml: string): number | null {
  const regex = new RegExp(
    `<CharCode>USD</CharCode>[\\s\\S]*?<Value>([\\d,.]+)</Value>`,
  );

  const match = xml.match(regex);
  if (!match) return null;

  return Number(match[1].replace(",", "."));
}

async function fetchTodayUSDRateBNM(): Promise<number> {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const date = `${day}.${month}.${year}`;

  const res = await fetch(
    `https://www.bnm.md/ru/official_exchange_rates?get_xml=1&date=${date}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch BNM USD rate");
  }

  const xml = await res.text();
  const rate = parseBnmXml(xml);

  if (!rate) {
    throw new Error("rate not found in BNM response");
  }

  return Number(rate.toFixed(4));
}

export const getTodayUSDRateBNM = unstable_cache(
  fetchTodayUSDRateBNM,
  ["usd-rate-bnm"],
  {
    revalidate: 60 * 60 * 12,
  },
);
