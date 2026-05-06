import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TIME_LABELS } from "./constant";

const currentHour = new Date().getHours();
export default function BreakTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-9" />

        <TableHead className="w-30" />

        <TableHead className="w-6" />

        {TIME_LABELS.map((h, i) => {
          const isCurrentHour = Number(h === "24" ? "0" : h) === currentHour;
          return (
            <TableHead
              key={i}
              className={cn(
                "text-md w-11 text-center",
                isCurrentHour ? "text-rd text-lg font-bold" : "text-bl",
              )}
            >
              {h}:
            </TableHead>
          );
        })}
        <TableHead className="w-8" />
      </TableRow>
    </TableHeader>
  );
}
