"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import NameFilter from "@/components/chart/name-filter";
import { CalculationCardType } from "../model/type";

const MIN_ROWS_DESKTOP = 32;
const MIN_ROWS_TABLET = 60;
const COL_MIN_WIDTH = 210;
const GAP = 16;
const BP_TABLET = 768;
const BP_DESKTOP = 1024;

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

function getRowsPerColumn(total: number, width: number) {
  if (!width || width < BP_TABLET) return Math.max(total, 1);

  const minRows = width < BP_DESKTOP ? MIN_ROWS_TABLET : MIN_ROWS_DESKTOP;
  const fitCols = Math.max(
    1,
    Math.floor((width + GAP) / (COL_MIN_WIDTH + GAP)),
  );

  return Math.max(minRows, Math.ceil(total / fitCols));
}

export default function TechCardPage({
  data,
}: {
  data: CalculationCardType[];
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(data.map((c) => c.category).filter(Boolean))),
    [data],
  );

  const filteredData =
    activeTab === "all" ? data : data.filter((c) => c.category === activeTab);

  const rows = getRowsPerColumn(filteredData.length, width);
  const columns = chunk(filteredData, rows);

  return (
    <div ref={ref} className="mt-2 h-[90dvh] w-full overflow-auto">
      <div className="flex min-h-full flex-col">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns.length || 1}, minmax(${COL_MIN_WIDTH}px, 1fr))`,
          }}
        >
          {columns.map((items, colIndex) => (
            <Table key={colIndex} className="table-auto">
              <TableBody>
                {items.map((card, index) => (
                  <TableRow
                    key={card.id || `${colIndex}-${index}`}
                    className="hover:bg-muted hover:[&>td]:text-rd! [&>td]:py-1"
                  >
                    <TableCell className="w-3 text-xs md:px-1">
                      {colIndex * rows + index + 1}
                    </TableCell>
                    <TableCell className="text-gr cursor-pointer truncate px-1 text-xs">
                      {card.name}
                    </TableCell>
                    <TableCell className="w-8 text-xs md:px-1">
                      {card.weight}
                    </TableCell>
                    <TableCell className="text-bl w-8 text-xs md:px-1">
                      {card.id || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
        </div>
        <div className="bg-background sticky bottom-0 z-10 mt-auto flex items-center justify-center">
          <NameFilter
            names={["all", ...categories] as readonly string[]}
            activeName={activeTab}
            onChange={(name) => setActiveTab(name)}
            isVisible={true}
          />
        </div>
      </div>
    </div>
  );
}
