export interface SaleItem {
  id: number;
  date: string;
  item: string;
  quantity: number;
  price: number;
  department: string;
  client: string;
}

export function parseExp(content: string): SaleItem[] {
  const lines = content.split(/\r?\n/);

  const products = new Map<
    number,
    {
      id: number;
      name: string;
      price: number;
    }
  >();

  const departments = new Map<number, string>();

  const clients = new Map<number, string>();

  let section = "";

  let currentDate = "";
  let currentDepartment = "";
  let currentClient = "";

  const result: SaleItem[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) continue;

    if (line.startsWith("#")) {
      section = line;
      continue;
    }

    if (section.startsWith("#Где")) {
      const match = line.match(/^(\d+)\s+(\d+)\s+(.+)$/);

      if (match) {
        departments.set(Number(match[1]), match[3]);
      }

      continue;
    }

    if (section.startsWith("#Кто")) {
      const match = line.match(/^(\d+)\s+(\d+)\s+(.+)$/);

      if (match) {
        clients.set(Number(match[1]), match[3]);
      }

      continue;
    }

    if (section.startsWith("#Что")) {
      const match = line.match(/^(\d+)\s+(\d+)\s+([\d.]+)\s+(.+)$/);

      if (match) {
        products.set(Number(match[1]), {
          id: Number(match[2]),
          price: Number(match[3]),
          name: match[4].split(",")[0].trim(),
        });
      }

      continue;
    }

    if (section.startsWith("#Как")) {
      const headerMatch = line.match(
        /^(\d{2}\.\d{2}\.\d{2})\s+(\d+)\s+\d+\s+\S+\s+\d+\s+\S+\s+(\d+)$/,
      );

      if (headerMatch) {
        const [, date, departmentRef, clientRef] = headerMatch;

        const [day, month, year] = date.split(".");

        currentDate = `20${year}-${month}-${day}`;

        currentDepartment = departments.get(Number(departmentRef)) ?? "";

        currentClient = clients.get(Number(clientRef)) ?? "";

        continue;
      }

      const itemMatch = line.match(/^\+\s+(\d+)\s+([\d.]+)\s+([\d.]+)$/);

      if (itemMatch) {
        const productIndex = Number(itemMatch[1]);

        const quantity = Number(itemMatch[2]);

        const product = products.get(productIndex);

        if (!product) continue;

        result.push({
          id: product.id,
          date: currentDate,
          item: product.name,
          quantity,
          price: product.price,
          department: currentDepartment,
          client: currentClient,
        });
      }
    }
  }

  return result;
}
