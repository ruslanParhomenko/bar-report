import * as XLSX from "xlsx";

const DT_RE = /^\d{8} \d{2}:\d{2}:\d{2}$/;

export interface HourBucket {
  name: string;
  value: number;
}

const HOURS = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4,
  5, 6, 7,
];

export function parseOrdersByHourOfDay(
  buffers: (ArrayBuffer | Uint8Array)[],
): HourBucket[] {
  const sums = new Map(HOURS.map((hour) => [hour, 0]));

  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  for (const buffer of buffers) {
    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
    });

    for (const row of rows) {
      const qtyCell = row[5];
      const dtCell = row[6];

      if (typeof dtCell !== "string") continue;

      const dt = dtCell.trim();

      if (!DT_RE.test(dt)) continue;

      const qty =
        typeof qtyCell === "number"
          ? qtyCell
          : Number.parseFloat(String(qtyCell));

      if (Number.isNaN(qty)) continue;

      const year = Number(dt.slice(0, 4));
      const month = Number(dt.slice(4, 6)) - 1;
      const day = Number(dt.slice(6, 8));

      const date = new Date(year, month, day);

      if (!minDate || date < minDate) {
        minDate = date;
      }

      if (!maxDate || date > maxDate) {
        maxDate = date;
      }

      const hour = Number(dt.slice(9, 11));

      if (!sums.has(hour)) continue;

      sums.set(hour, sums.get(hour)! + qty);
    }
  }

  const days =
    minDate && maxDate
      ? Math.floor((maxDate.getTime() - minDate.getTime()) / 86_400_000) + 1
      : 0;

  if (days === 0) {
    return HOURS.map((hour) => ({
      name: hour === 0 ? "24" : String(hour).padStart(2, "0"),
      value: 0,
    }));
  }

  return HOURS.map((hour) => ({
    name: hour === 0 ? "24" : String(hour).padStart(2, "0"),
    value: Number((sums.get(hour)! / days).toFixed(0)),
  }));
}
