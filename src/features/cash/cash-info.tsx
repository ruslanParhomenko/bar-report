import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getMonthDays } from "@/utils/getMonthDays";
import { UseFormReturn } from "react-hook-form";
import { CashFormTypeInput } from "./schema";
import { cn } from "@/lib/utils";

export default function CashInfo({
  monthDays,
  form,
  isDisabled,
}: {
  monthDays: ReturnType<typeof getMonthDays>;
  form: UseFormReturn<CashFormTypeInput>;
  isDisabled?: boolean;
}) {
  const { register } = form;
  const value = form.watch("rowCashData");
  const start_241 = Number(form.watch("start_241") || 0);
  const z_531 = Number(form.watch("z_531") || 0);
  const ao_532 = Number(form.watch("ao_532") || 0);
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
  return (
    <TableBody>
      <TableRow className="h-12" />
      <TableRow>
        <TableCell colSpan={monthDays.length}>
          <div className="flex gap-4 text-gn items-center">
            <div>
              <span className=" font-bold">remaining cash:</span>
              <span className="bg-accent h-7 py-1.5 px-2 ml-4 text-xs">
                {(
                  Number(totalCashBar) -
                  Number(totalVisa) -
                  Number(totalBank) -
                  Number(totalNbmCollection)
                ).toFixed(2)}
              </span>
            </div>
            <div>
              <span className=" font-bold">visa difference:</span>
              <span className="bg-accent h-7 py-1.5 px-2 ml-4 text-xs">
                {(Number(totalVisaBar) - Number(totalVisa)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className=" font-bold">start-241:</span>
              <input
                type="text"
                disabled={isDisabled}
                {...register("start_241")}
                className={cn(
                  "border-0 bg-accent  p-0 ml-4 h-7 text-center  shadow-none text-xs w-24"
                )}
              />
            </div>
            <div>
              <span className=" font-bold">832:</span>
              <span className="bg-accent h-7 py-1.5 px-2 ml-4 text-xs">
                {totalNbmCollection ?? 0}
              </span>
            </div>
            <div>
              <span className=" font-bold">z-531:</span>
              <input
                type="text"
                disabled={isDisabled}
                {...register("z_531")}
                className={cn(
                  "border-0 bg-accent  p-0 ml-4 h-7 text-center  shadow-none text-xs w-24"
                )}
              />
            </div>
            <div>
              <span className=" font-bold">ao-532:</span>
              <input
                type="text"
                disabled={isDisabled}
                {...register("ao_532")}
                className={cn(
                  "border-0 bg-accent  p-0 ml-4 h-7 text-center  shadow-none text-xs w-24"
                )}
              />
            </div>
            <div>
              <span className=" font-bold">final_241:</span>
              <span className="bg-accent h-7 py-1.5 px-2 ml-4 text-xs">
                {(
                  start_241 +
                  Number(totalNbmCollection ?? 0) -
                  z_531 -
                  ao_532
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
