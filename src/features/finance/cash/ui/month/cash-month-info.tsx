import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { CashForm } from "../../model/schema";

export default function CashInfo({ isEdit }: { isEdit?: boolean }) {
  const { monthDays } = useMonthDays();
  const { register, control } = useFormContext<CashForm>();
  const value = useWatch({ control, name: "rowCashData" });

  const start_241 = Number(useWatch({ control, name: "start_241" }) || 0);
  const z_531 = Number(useWatch({ control, name: "z_531" }) || 0).toFixed(2);
  const ao_532 = Number(useWatch({ control, name: "ao_532" }) || 0).toFixed(2);

  const totalCash1C = value?.cashBarByDay
    ? Object.values(value.cashBarByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalCash1CBuffet = value?.cashBarByDayBuffet
    ? Object.values(value.cashBarByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const total1C = Number(totalCash1C) + Number(totalCash1CBuffet);

  const totalCashBar = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalCashBarBuffet = value?.cashBuffet
    ? Object.values(value.cashBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalCashFiscal = Number(totalCashBar) + Number(totalCashBarBuffet);

  const totalVisaBar = value?.visaBarByDay
    ? Object.values(value.visaBarByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalVisaBarBuffet = value?.visaBarByDayBuffet
    ? Object.values(value.visaBarByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalVisaFiscal = Number(totalVisaBar) + Number(totalVisaBarBuffet);

  const totalVisaTerminal = value?.visaTerminalByDay
    ? Object.values(value.visaTerminalByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalVisaTerminalBuffet = value?.visaTerminalByDayBuffet
    ? Object.values(value.visaTerminalByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalVisaTerminalFiscal =
    Number(totalVisaTerminal) + Number(totalVisaTerminalBuffet);

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
    Number(totalCashFiscal) -
    Number(totalVisaFiscal) -
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
              <span className="font-bold">total cash fiscal:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {totalCashFiscal.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="font-bold">visa terminal:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {totalVisaTerminalFiscal.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="font-bold">visa fiscal:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {totalVisaFiscal.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="font-bold">total cash 1C:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {total1C.toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
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
                {(
                  Number(totalVisaFiscal) - Number(totalVisaTerminalFiscal)
                ).toFixed(2)}
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
