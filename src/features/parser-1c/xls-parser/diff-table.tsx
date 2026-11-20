"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MonthRow, SalesByMonth } from "@/lib/parse-xls";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

const METRICS = [
  { key: "start", label: "начало" },
  { key: "bought", label: "куплено" },
  { key: "sold", label: "продано" },
  { key: "end", label: "остаток" },
] as const;

const ALL = "all";
const COL_W = "10.5dvw";

type MetricKey = (typeof METRICS)[number]["key"];
type MetricSel = MetricKey | typeof ALL;
type Cell = { qty: number; sum: number };
type Metrics = Record<MetricKey, Cell>;
type Side = "bar" | "nori";

const SIDES = ["bar", "nori"] as const;

const SIDE_COLOR: Record<Side, string> = {
  bar: "text-green-600",
  nori: "text-foreground",
};

const emptyMetrics = (): Metrics => ({
  start: { qty: 0, sum: 0 },
  bought: { qty: 0, sum: 0 },
  sold: { qty: 0, sum: 0 },
  end: { qty: 0, sum: 0 },
});

function addRow(acc: Metrics, r: MonthRow) {
  acc.start.qty += r.startQty;
  acc.start.sum += r.startSum;
  acc.bought.qty += r.boughtQty;
  acc.bought.sum += r.boughtSum;
  acc.sold.qty += r.soldQty;
  acc.sold.sum += r.soldSum;
  acc.end.qty += r.endQty;
  acc.end.sum += r.endSum;
}

const round = (n: number, d: number) => {
  const k = 10 ** d;
  return Math.round(n * k) / k;
};

const fmt = (n: number, d: number) =>
  n.toLocaleString("ru-RU", { maximumFractionDigits: d });

const diff = (a?: Cell, b?: Cell): Cell => ({
  qty: (a?.qty ?? 0) - (b?.qty ?? 0),
  sum: (a?.sum ?? 0) - (b?.sum ?? 0),
});

function Num({ cell, qtyClass }: { cell?: Cell; qtyClass?: string }) {
  const qty = round(cell?.qty ?? 0, 3);
  const sum = round(cell?.sum ?? 0, 2);

  if (!qty && !sum) return <span className="text-muted-foreground">—</span>;

  return (
    <span>
      <span className={qtyClass}>{fmt(qty, 3)}</span>{" "}
      <span className="text-muted-foreground text-[10px]">({fmt(sum, 2)})</span>
    </span>
  );
}

const head = "bg-background sticky z-10 border-r border-b text-xs p-0!";
const cellBase = "border-r border-b px-2 py-1 text-right align-middle text-xs";

export function DiffTable({ data }: { data: SalesByMonth }) {
  const [warehouse, setWarehouse] = useState<string>(ALL);
  const [metric, setMetric] = useState<MetricSel>(ALL);

  const visible =
    metric === ALL ? METRICS : METRICS.filter((m) => m.key === metric);
  const diffKey = metric === ALL ? null : metric; // null: diff скрыт

  const warehouses = useMemo(() => {
    const set = new Set<string>();
    for (const rows of Object.values(data ?? {})) {
      for (const r of rows) set.add(r.warehouse);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "ru"));
  }, [data]);

  const rows = useMemo(() => {
    const map = new Map<string, Partial<Record<Side, Metrics>>>();

    for (const side of SIDES) {
      for (const r of data?.[side] ?? []) {
        if (warehouse !== ALL && r.warehouse !== warehouse) continue;

        const name = r.name.trim();
        const entry = map.get(name) ?? {};
        const acc = entry[side] ?? emptyMetrics();
        addRow(acc, r);
        entry[side] = acc;
        map.set(name, entry);
      }
    }

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "ru"))
      .map(([name, v]) => ({ name, bar: v.bar, nori: v.nori }));
  }, [data, warehouse]);

  const totals = useMemo(() => {
    const t: Record<Side, Metrics> = {
      bar: emptyMetrics(),
      nori: emptyMetrics(),
    };
    for (const row of rows) {
      for (const side of SIDES) {
        const m = row[side];
        if (!m) continue;
        for (const { key } of METRICS) {
          t[side][key].qty += m[key].qty;
          t[side][key].sum += m[key].sum;
        }
      }
    }
    return t;
  }, [rows]);

  if (!data || !Object.keys(data).length) {
    return (
      <div className="text-muted-foreground p-4 text-xs">
        Выберите файлы bar и nori
      </div>
    );
  }

  const colCount = 1 + (diffKey ? 1 : 0) + SIDES.length * visible.length;
  const totalDiff = diffKey
    ? diff(totals.bar[diffKey], totals.nori[diffKey])
    : undefined;
  const totalDq = round(totalDiff?.qty ?? 0, 3);

  return (
    <div className="flex h-full min-h-0 flex-col px-2">
      <div className="min-h-0 flex-1 border-t border-l [&>div]:h-full [&>div]:overflow-auto">
        <Table
          className="table-fixed border-separate border-spacing-0"
          style={{ width: `calc(${COL_W} * ${colCount})` }}
        >
          <colgroup>
            {Array.from({ length: colCount }, (_, i) => (
              <col key={i} style={{ width: COL_W }} />
            ))}
          </colgroup>

          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className={cn(head, "top-0 left-0 z-20 p-1 text-left")}
              >
                <div className="flex gap-1">
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger className="h-6! w-full px-1 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>все склады</SelectItem>
                      {warehouses.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={metric}
                    onValueChange={(v) => setMetric(v as MetricSel)}
                  >
                    <SelectTrigger className="h-6! w-full px-1 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>все</SelectItem>
                      {METRICS.map((m) => (
                        <SelectItem key={m.key} value={m.key}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>

              {diffKey && (
                <TableHead
                  title="bar − nori"
                  className={cn(head, "top-0 h-8 text-center")}
                >
                  diff
                </TableHead>
              )}

              {SIDES.flatMap((side) =>
                visible.map((m) => (
                  <TableHead
                    key={`${side}-${m.key}`}
                    className={cn(head, "top-0 h-8 text-center")}
                  >
                    {m.label}-{side}
                  </TableHead>
                )),
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => {
              const d = diffKey
                ? diff(row.bar?.[diffKey], row.nori?.[diffKey])
                : undefined;
              const dq = round(d?.qty ?? 0, 3);

              return (
                <TableRow key={row.name} className="border-b-0">
                  <TableCell
                    className={cn(
                      cellBase,
                      "bg-background sticky left-0 z-1 px-1 text-left align-top wrap-break-word whitespace-normal",
                    )}
                  >
                    {row.name}
                  </TableCell>

                  {d && (
                    <TableCell className={cn(cellBase, "px-1 text-center")}>
                      <Num
                        cell={d}
                        qtyClass={
                          dq > 0
                            ? "text-blue-600"
                            : dq < 0
                              ? "text-red-600"
                              : undefined
                        }
                      />
                    </TableCell>
                  )}

                  {SIDES.flatMap((side) =>
                    visible.map((m) => (
                      <TableCell key={`${side}-${m.key}`} className={cellBase}>
                        <Num
                          cell={row[side]?.[m.key]}
                          qtyClass={SIDE_COLOR[side]}
                        />
                      </TableCell>
                    )),
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter className="bg-background">
            <TableRow className="hover:bg-transparent">
              <TableCell
                className={cn(
                  cellBase,
                  "bg-background sticky bottom-0 left-0 z-20 border-t px-1 text-left font-medium",
                )}
              >
                Итого
              </TableCell>

              {totalDiff && (
                <TableCell
                  className={cn(
                    cellBase,
                    "bg-background sticky bottom-0 z-10 border-t px-1 text-center font-medium",
                  )}
                >
                  <Num
                    cell={totalDiff}
                    qtyClass={
                      totalDq > 0
                        ? "text-blue-600"
                        : totalDq < 0
                          ? "text-red-600"
                          : undefined
                    }
                  />
                </TableCell>
              )}

              {SIDES.flatMap((side) =>
                visible.map((m) => (
                  <TableCell
                    key={`${side}-${m.key}`}
                    className={cn(
                      cellBase,
                      "bg-background sticky bottom-0 z-10 border-t font-medium",
                    )}
                  >
                    <Num
                      cell={totals[side][m.key]}
                      qtyClass={SIDE_COLOR[side]}
                    />
                  </TableCell>
                )),
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
