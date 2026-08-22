import * as XLSX from "xlsx";

const DT_RE = /^\d{8} \d{2}:\d{2}:\d{2}$/;

export interface OrderRecord {
  dt: Date;
  qty: number;
}

export interface HourBucket {
  name: string;
  value: number;
}

export function extractRecords(
  buffer: ArrayBuffer | Uint8Array,
): OrderRecord[] {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const wb = XLSX.read(bytes, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: "",
  });

  const records: OrderRecord[] = [];

  for (const row of rows) {
    const qtyCell = row[5];
    const dtCell = row[6];

    if (typeof dtCell !== "string") continue;
    const dtStr = dtCell.trim();
    if (!DT_RE.test(dtStr)) continue;

    const qty =
      typeof qtyCell === "number" ? qtyCell : parseFloat(String(qtyCell));
    if (Number.isNaN(qty)) continue;

    const y = +dtStr.slice(0, 4);
    const mo = +dtStr.slice(4, 6);
    const d = +dtStr.slice(6, 8);
    const h = +dtStr.slice(9, 11);
    const mi = +dtStr.slice(12, 14);
    const s = +dtStr.slice(15, 17);

    records.push({ dt: new Date(y, mo - 1, d, h, mi, s), qty });
  }

  return records;
}

/**
 * Строит метки часов и границы интервалов для суточной смены
 * 07:00 -> 07:00 следующего дня, основываясь на самой ранней записи.
 */
function buildHourBuckets(records: OrderRecord[]): {
  labels: string[];
  ranges: [Date, Date][];
} {
  if (records.length === 0) return { labels: [], ranges: [] };

  const earliest = records.reduce((a, b) => (a.dt < b.dt ? a : b)).dt;
  const baseDay = new Date(
    earliest.getFullYear(),
    earliest.getMonth(),
    earliest.getDate(),
  );
  if (earliest.getHours() < 7) {
    baseDay.setDate(baseDay.getDate() - 1);
  }
  const nextDay = new Date(baseDay);
  nextDay.setDate(nextDay.getDate() + 1);

  const at = (base: Date, h: number) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate(), h);

  const labels: string[] = [];
  const ranges: [Date, Date][] = [];

  for (let h = 7; h < 24; h++) {
    labels.push(String(h).padStart(2, "0"));
    ranges.push([at(baseDay, h), at(baseDay, h + 1)]);
  }
  for (let h = 0; h < 7; h++) {
    labels.push(h === 0 ? "24" : String(h).padStart(2, "0"));
    ranges.push([at(nextDay, h), at(nextDay, h + 1)]);
  }
  labels.push("07");
  ranges.push([at(nextDay, 7), at(nextDay, 8)]);

  return { labels, ranges };
}

/**
 * Суммирует "Кол-во" по часовым интервалам и возвращает массив
 * {name, value} — метка часа и сумма количества заказов за этот час.
 */
export function summarize(records: OrderRecord[]): HourBucket[] {
  const { labels, ranges } = buildHourBuckets(records);
  const sums = new Array(labels.length).fill(0);

  for (const { dt, qty } of records) {
    for (let i = 0; i < ranges.length; i++) {
      const [start, end] = ranges[i];
      if (dt >= start && dt < end) {
        sums[i] += qty;
        break;
      }
    }
  }

  return labels.map((name, i) => ({ name, value: sums[i] }));
}

/**
 * Полный пайплайн: несколько буферов .xls -> почасовой JSON.
 */
export function parseOrdersToHourlyJson(
  buffers: (ArrayBuffer | Uint8Array)[],
): HourBucket[] {
  const allRecords = buffers.flatMap((buf) => extractRecords(buf));
  return summarize(allRecords);
}
