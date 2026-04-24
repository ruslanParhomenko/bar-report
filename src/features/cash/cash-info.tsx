import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { useFormContext } from "react-hook-form";
import { CashForm } from "./schema";

export default function CashInfo({ isEdit }: { isEdit?: boolean }) {
  const { monthDays } = useMonthDays();
  const { register, watch } = useFormContext<CashForm>();
  const value = watch("rowCashData");
  const start_241 = Number(watch("start_241") || 0);
  const z_531 = Number(watch("z_531") || 0);
  const ao_532 = Number(watch("ao_532") || 0).toFixed(2);
  const totalCashBar = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalVisaBar = value?.visaBarByDay
    ? Object.values(value.visaBarByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalVisa = value?.visaTerminalByDay
    ? Object.values(value.visaTerminalByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalBank = value?.bankCollectionByDay
    ? Object.values(value.bankCollectionByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalNbmCollection = value?.nbmCollectionByDay
    ? Object.values(value.nbmCollectionByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const remainingCash =
    Number(totalCashBar) -
    Number(totalVisa) -
    Number(totalBank) -
    Number(totalNbmCollection);

  const finalCash =
    Number(start_241) +
    Number(totalNbmCollection ?? 0) -
    Number(z_531) -
    Number(ao_532);

  return (
    <TableBody>
      <TableRow className="h-12" />
      <TableRow>
        <TableCell colSpan={monthDays.length}>
          <div className="text-gn flex items-center gap-4">
            <div>
              <span className="font-bold">remaining cash:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {remainingCash.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="font-bold">visa difference:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {(Number(totalVisaBar) - Number(totalVisa)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="font-bold">start-241:</span>
              <input
                type="text"
                disabled={!isEdit}
                {...register("start_241")}
                className={cn(
                  "ml-4 h-7 w-24 border-0 p-0 text-center text-xs shadow-none",
                  isEdit && "bg-accent",
                )}
              />
            </div>
            <div>
              <span className="font-bold">832:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {totalNbmCollection ?? 0}
              </span>
            </div>
            <div>
              <span className="font-bold">z-531:</span>
              <input
                type="text"
                disabled={!isEdit}
                {...register("z_531")}
                className={cn(
                  "ml-4 h-7 w-24 border-0 p-0 text-center text-xs shadow-none",
                  isEdit && "bg-accent",
                )}
              />
            </div>
            <div>
              <span className="font-bold">ao-532:</span>
              <input
                type="text"
                disabled={!isEdit}
                {...register("ao_532")}
                className={cn(
                  "ml-4 h-7 w-24 border-0 p-0 text-center text-xs shadow-none",
                  isEdit && "bg-accent",
                )}
              />
            </div>
            <div>
              <span className="font-bold">final_241:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {finalCash.toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
