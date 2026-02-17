"use client";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TIME_LABELS } from "./constant";

const currentHour = new Date().getHours();
export default function BreakTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-40" />
        <TableHead className="w-6" />

        {TIME_LABELS.map((h, i) => {
          const isCurrentHour = Number(h === "24" ? "0" : h) === currentHour;
          return (
            <TableHead
              key={i}
              className={cn(
                "text-center text-md w-11",
                isCurrentHour ? "text-rd font-bold text-lg" : "text-bl",
              )}
            >
              {h}:
            </TableHead>
          );
        })}
        <TableHead className="w-6" />
      </TableRow>
    </TableHeader>
  );
}
