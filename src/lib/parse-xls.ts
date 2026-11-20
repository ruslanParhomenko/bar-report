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

const DAY_RE = /^(\d{2})\.(\d{2})\.(\d{2})$/;

export interface SaleRow {
  unit: string;
  day: string;
  name: string;
  time: string;
}
export interface ParsedSales {
  result: SaleRow[];
  uniqName: string[];
}

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

// CP1251 fix

const CYR_RE = /[\u0400-\u04FF]/;
const WIN1251 = new TextDecoder("windows-1251");
const WIN1252 = new TextDecoder("windows-1252");

const CP1252_REVERSE = new Map<string, number>();
for (let b = 0x80; b <= 0x9f; b++) {
  CP1252_REVERSE.set(WIN1252.decode(new Uint8Array([b])), b);
}

function fixCp1251(text: string): string {
  if (
    !text ||
    CYR_RE.test(text) ||
    !/[\u0080-\u00FF\u0152-\u2122]/.test(text)
  ) {
    return text;
  }
  const bytes = Uint8Array.from(text, (ch) => {
    const code = ch.charCodeAt(0);
    return code < 256 ? code : (CP1252_REVERSE.get(ch) ?? 0x3f);
  });
  return WIN1251.decode(bytes);
}

export function parseSales(buffers: (ArrayBuffer | Uint8Array)[]): ParsedSales {
  const result: SaleRow[] = [];
  const names = new Set<string>();

  for (const buffer of buffers) {
    const workbook = XLSX.read(buffer, { type: "array", codepage: 1251 });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      defval: "",
    });

    let unit: string | null = null;
    let day: string | null = null;

    for (const row of rows) {
      const name = String(row[2] ?? "").trim();
      const header = String(row[3] ?? "").trim();
      const ts = String(row[6] ?? "").trim();

      if (unit === null && header) {
        unit = header.split(/\s{2,}/)[0].trim();
        continue;
      }

      const d = name.match(DAY_RE);
      if (d) {
        day = `20${d[3]}-${d[2]}-${d[1]}`;
        continue;
      }

      if (!unit || !day || !name || !DT_RE.test(ts)) continue;

      const fixedName = fixCp1251(name);
      names.add(fixedName);
      result.push({
        unit: fixCp1251(unit),
        day,
        name: fixedName,
        time: ts.slice(9, 14),
      });
    }
  }

  return {
    result,
    uniqName: [...names].sort((a, b) => a.localeCompare(b, "ru")),
  };
}

export type MonthRow = {
  name: string;
  warehouse: string;
  startSum: number;
  startQty: number;
  boughtSum: number; // 521
  boughtQty: number;
  soldSum: number; // 811
  soldQty: number;
  endSum: number;
  endQty: number;
};

export type SalesFile = { name: string; buffer: ArrayBuffer | Uint8Array };
export type SalesByMonth = Record<string, MonthRow[]>;

const QTY = "Кол-во";
const TOTAL = "Итоги";

const num = (v: unknown) => (typeof v === "number" ? v : 0);
const cell = (v: unknown) => fixCp1251(String(v ?? "").trim());

// "bar_10.xls" -> "bar", "nori_10.xls" -> "nori"
const fileKey = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_\-\s]*\d+$/, "")
    .toLowerCase();

export function salesByMonth(files: SalesFile[]): SalesByMonth {
  const out: SalesByMonth = {};

  for (const { name: fileName, buffer } of files) {
    const workbook = XLSX.read(buffer, { type: "array", codepage: 1251 });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      defval: "",
    });

    // колонки определяем по шапке: у bar есть лишняя 826, у nori 713 вместо 714
    const h = rows.findIndex(
      (r) =>
        r.some((c) => String(c).trim() === "521") &&
        r.some((c) => String(c).trim() === "811"),
    );
    if (h < 0) continue;

    const head = rows[h].map((c) => String(c).trim());
    const iStart = head.findIndex((c, i) => i > 1 && c); // Нач. остаток
    const iBought = head.indexOf("521");
    const iSold = head.indexOf("811");
    const iEnd = head.length - 1 - [...head].reverse().findIndex(Boolean); // Кон. остаток

    const pick = (r: unknown[]) =>
      [r[iStart], r[iBought], r[iSold], r[iEnd]].map(num);

    const list: MonthRow[] = [];
    let name = "";
    let warehouse: string | null = null;
    let sums: number[] | null = null;

    for (let i = h + 2; i < rows.length; i++) {
      const r = rows[i];
      const c1 = cell(r[1]);
      const c2 = cell(r[2]);

      if (c1 === TOTAL) break;
      if (c1) {
        if (c1 !== QTY) name = c1; // строка материала; её "Кол-во" пропускаем
        continue;
      }
      if (!c2) continue;

      if (c2 === QTY) {
        if (warehouse && sums) {
          const q = pick(r);
          list.push({
            name,
            warehouse,
            startSum: sums[0],
            startQty: q[0],
            boughtSum: sums[1],
            boughtQty: q[1],
            soldSum: sums[2],
            soldQty: q[2],
            endSum: sums[3],
            endQty: q[3],
          });
        }
        warehouse = null;
        sums = null;
        continue;
      }

      warehouse = c2;
      sums = pick(r);
    }

    out[fileKey(fileName)] = list;
  }

  return out;
}
