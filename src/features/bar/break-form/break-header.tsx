import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TIME_LABELS } from "./constant";

const currentHour = new Date().getHours();
export default function BreakTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-4 md:w-6" />
        <TableHead className="w-6 md:w-9" />

        <TableHead className="w-28" />

        <TableHead className="w-4 md:w-6" />

        {TIME_LABELS.map((h, i) => {
          const isCurrentHour = Number(h === "24" ? "0" : h) === currentHour;
          return (
            <TableHead
              key={i}
              className={cn(
                "w-6 px-0 text-center text-xs md:w-11 md:px-2 md:text-sm",
                isCurrentHour ? "text-rd font-bold md:text-lg" : "text-bl",
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
