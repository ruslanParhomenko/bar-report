import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { getAllAgentData } from "../lib/utils";

export default function TtnModaFooterTable({
  data,
}: {
  data: ReturnType<typeof getAllAgentData>;
}) {
  const footerTotalMinus = data.reduce((acc, d) => acc + d.totalMinus, 0);
  const footerTotalPlus = data.reduce((acc, d) => acc + d.totalPlus, 0);
  const footerFinalBalance = data.reduce((acc, d) => acc + d.finalBalance, 0);

  const footerMonthTotals = MONTHS.map((month) => {
    const minus = data.reduce((acc, d) => {
      const m = d.agentMonthData.find((md) => md.month === month);
      return acc + (m?.minus ?? 0);
    }, 0);
    const plus = data.reduce((acc, d) => {
      const m = d.agentMonthData.find((md) => md.month === month);
      return acc + (m?.plus ?? 0);
    }, 0);
    return { month, minus, plus };
  });
  return (
    <TableFooter>
      <TableRow className="[&>td]:p-1">
        <TableCell>
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
            <span className="text-rd">{footerTotalMinus.toFixed(2)}</span>
            <span className="text-bl">{footerTotalPlus.toFixed(2)}</span>
          </div>
        </TableCell>

        <TableCell className="border-x text-xs" />

        <TableCell
          className={cn(
            footerFinalBalance < 0 ? "text-rd" : "text-bl",
            "border-x text-right text-xs font-bold",
          )}
        >
          {footerFinalBalance.toFixed(2)}
        </TableCell>

        {footerMonthTotals.map(({ month, minus, plus }) => (
          <TableCell key={month} className="border-x">
            <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
              <span className={cn("text-rd", minus === 0 && "opacity-0")}>
                {minus !== 0 ? minus.toFixed(2) : ""}
              </span>
              <span className={cn("text-bl", plus === 0 && "opacity-0")}>
                {plus !== 0 ? plus.toFixed(2) : ""}
              </span>
            </div>
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
}
