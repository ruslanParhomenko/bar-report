"use client";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export function useSheetData({ range }: { range: string }) {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname().split("/")[2];
  const TABLE_ROWS = {
    cucina: 11,
    bar: 21,
  };

  useEffect(() => {
    async function fetchSheet() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Ошибка при загрузке данных");
        }
        const json = await response.json();
        const values: string[][] = json.values || [];

        const totalRows =
          (TABLE_ROWS[pathname as keyof typeof TABLE_ROWS] as number) || 22;
        const totalCols = 36;

        const filledData: string[][] = [];
        for (let r = 0; r < totalRows; r++) {
          filledData[r] = [];
          for (let c = 0; c < totalCols; c++) {
            filledData[r][c] = values[r]?.[c] ?? "";
          }
        }

        setData(filledData);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchSheet();
    const intervalId = setInterval(fetchSheet, 100000);
    return () => clearInterval(intervalId);
  }, [range]);

  return { data, loading, error };
}
