import ExcelJS from "exceljs";

export interface Product {
  id: number;
  name: string;
  unit: string;
  released: number;
  product: number;
  cost: number;
  price: number;
}

const HEADERS = {
  id: ["id", "код", "№", "номер", "артикул"],

  name: [
    "name",
    "наименование",
    "название",
    "товар",
    "продукт",
    "блюдо",
    "позиция",
  ],

  unit: ["unit", "ед", "ед.", "единица", "единица измерения", "изм", "ед изм"],

  released: ["released", "выход", "выходгр", "выход,гр", "нетто", "масса"],

  product: ["product", "сырье", "закладка", "количество", "вес"],

  cost: ["cost", "себестоимость", "с/с", "закупка", "costprice"],

  price: ["price", "цена", "продажа", "розница", "ценапродажи"],
};

const normalize = (value: unknown) =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[().,_-]/g, "");

const toNumber = (value: unknown) =>
  Number(
    String(value ?? "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, ""),
  ) || 0;

function findHeaderRow(rows: any[][]) {
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const row = rows[i].map(normalize);

    const matches = row.filter((cell) =>
      Object.values(HEADERS).flat().includes(cell),
    );

    if (matches.length >= 3) return i;
  }

  return 0;
}

function findColumns(header: any[]) {
  const result: Record<string, number> = {};

  header.forEach((cell, index) => {
    const value = normalize(cell);

    for (const [key, names] of Object.entries(HEADERS)) {
      if (names.map(normalize).includes(value)) {
        result[key] = index;
      }
    }
  });

  return result;
}

export async function parseExcel(file: File): Promise<Product[]> {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.worksheets[0];

  if (!sheet) {
    throw new Error("Лист не найден");
  }

  const rows: any[][] = [];

  sheet.eachRow((row) => {
    // Гарантируем, что values — это массив
    const values = Array.isArray(row.values) ? row.values : [];

    // Теперь .slice(1) и .map() безопасны, а оператор ?? [] в конце больше не нужен
    rows.push(
      values.slice(1).map((cell: any) => {
        if (cell == null) return "";

        if (typeof cell === "object") {
          if ("text" in cell) return cell.text;
          if ("result" in cell) return cell.result;
          if ("richText" in cell)
            return cell.richText.map((r: any) => r.text).join("");
        }

        return cell;
      }),
    );
  });

  const headerIndex = findHeaderRow(rows);
  const columns = findColumns(rows[headerIndex]);

  // Проверяем, нашлись ли вообще строки, чтобы не упасть на rows[headerIndex]
  if (rows.length === 0 || !rows[headerIndex]) return [];

  return rows
    .slice(headerIndex + 1)
    .filter((row) => row.some(Boolean))
    .map((row, index) => ({
      id: columns.id !== undefined ? toNumber(row[columns.id]) : index + 1,
      name:
        columns.name !== undefined
          ? String(row[columns.name] ?? "").trim()
          : "",
      unit:
        columns.unit !== undefined
          ? String(row[columns.unit] ?? "").trim()
          : "",
      released:
        columns.released !== undefined ? toNumber(row[columns.released]) : 0,
      product:
        columns.product !== undefined ? toNumber(row[columns.product]) : 0,
      cost: columns.cost !== undefined ? toNumber(row[columns.cost]) : 0,
      price: columns.price !== undefined ? toNumber(row[columns.price]) : 0,
    }))
    .filter((item) => item.name);
}
