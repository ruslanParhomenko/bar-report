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

function buildHourBuckets(records: OrderRecord[]): {
  labels: string[];
  ranges: [Date, Date][];
} {
  if (records.length === 0) return { labels: [], ranges: [] };

  const sorted = [...records].sort((a, b) => a.dt.getTime() - b.dt.getTime());
  const shiftStart = sorted.find((r) => r.dt.getHours() >= 7) ?? sorted[0];

  const baseDay = new Date(
    shiftStart.dt.getFullYear(),
    shiftStart.dt.getMonth(),
    shiftStart.dt.getDate(),
  );
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

function summarizeShift(records: OrderRecord[]): HourBucket[] {
  if (records.length === 0) return [];

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

export function summarize(records: OrderRecord[]): HourBucket[] {
  return summarizeShift(records);
}

export function parseOrdersToHourlyJson(
  buffers: (ArrayBuffer | Uint8Array)[],
): HourBucket[] {
  const merged = new Map<string, number>();

  for (const buf of buffers) {
    const records = extractRecords(buf);
    const shiftResult = summarizeShift(records);
    for (const { name, value } of shiftResult) {
      merged.set(name, (merged.get(name) ?? 0) + value);
    }
  }

  return Array.from(merged, ([name, value]) => ({ name, value }));
}
