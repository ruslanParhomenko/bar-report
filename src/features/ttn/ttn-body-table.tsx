import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { SuppliersFormTypeInput } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";

export default function TTNBodyTable({
  arrayRows,
  monthDays,
  form,
  isDisabled,
}: {
  arrayRows: string[];
  monthDays: ReturnType<typeof import("@/utils/getMonthDays").getMonthDays>;
  form: UseFormReturn<SuppliersFormTypeInput>;
  isDisabled?: boolean;
}) {
  const { register } = form;
  const value = useWatch({
    control: form.control,
    name: "rowSuppliers",
  });
  console.log(value);

  const currentDay = new Date().getDate();

  let totalCreditStartSum = 0;
  let totalDebitStartSum = 0;

  let totalMinusSum = 0;
  let totalPlusSum = 0;

  console.log(currentDay);

  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);

  return (
    <TableBody>
      {arrayRows.map((row, rowIndex) => {
        const rowData = value?.[row];
        const minusTotal = sum(rowData?.minus);
        const plusTotal = sum(rowData?.plus);
        const startAmount = Number(rowData?.start || 0);
        const finalTotal = startAmount + minusTotal + plusTotal;

        const isRowByCurrentDay = value?.[row]?.plus?.[currentDay - 1];

        totalCreditStartSum += startAmount < 0 ? startAmount : 0;
        totalDebitStartSum += startAmount > 0 ? startAmount : 0;
        totalMinusSum += minusTotal;
        totalPlusSum += plusTotal;

        return (
          <TableRow key={row}>
            <TableCell className="text-xs p-0 pr-2  border-r">
              <div className="w-30 flex  items-center justify-between">
                <div className="flex flex-col  items-end">
                  <span
                    className={cn(
                      "text-rd",
                      minusTotal === 0 && "text-muted-foreground"
                    )}
                  >
                    {minusTotal.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "text-bl",
                      plusTotal === 0 && "text-muted-foreground"
                    )}
                  >
                    {plusTotal.toFixed(2)}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-bold text-gn",
                    Number(finalTotal) === 0 &&
                      "text-muted-foreground font-light"
                  )}
                >
                  {finalTotal.toFixed(2)}
                </span>
              </div>
            </TableCell>

            <TableCell className="text-start p-0 pl-1">
              <span
                className={cn(
                  "truncate font-bold",
                  isRowByCurrentDay && "text-rd"
                )}
              >
                {row}
              </span>
            </TableCell>
            <TableCell className="text-center text-xs w-16 p-0  border-l">
              <input
                {...register(
                  `rowSuppliers.${row}.start` as FieldPath<SuppliersFormTypeInput>
                )}
                data-row={rowIndex * 2}
                data-col={-1}
                className="h-full w-14 text-start border-0 m-0 box-border p-0 leading-none"
                onKeyDown={(e) => handleTableNavigation(e, rowIndex * 2, -1)}
                disabled={isDisabled}
              />
            </TableCell>
            {monthDays.map((_, dayIndex) => (
              <TableCell key={dayIndex} className="p-0 border-x">
                <div className="flex flex-col h-8 p-0">
                  <input
                    {...register(
                      `rowSuppliers.${row}.minus.${dayIndex}` as FieldPath<SuppliersFormTypeInput>
                    )}
                    data-row={rowIndex * 2}
                    data-col={dayIndex}
                    className="h-4 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none px-1 text-rd"
                    onKeyDown={(e) =>
                      handleTableNavigation(e, rowIndex * 2, dayIndex)
                    }
                    disabled={isDisabled}
                  />
                  <input
                    {...register(
                      `rowSuppliers.${row}.plus.${dayIndex}` as FieldPath<SuppliersFormTypeInput>
                    )}
                    data-row={rowIndex * 2 + 1}
                    data-col={dayIndex}
                    className="h-4 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none px-1 text-bl"
                    onKeyDown={(e) =>
                      handleTableNavigation(e, rowIndex * 2 + 1, dayIndex)
                    }
                    disabled={isDisabled}
                  />
                </div>
              </TableCell>
            ))}
          </TableRow>
        );
      })}

      <TableRow className="sticky bottom-0.5 bg-background">
        <TableCell className="text-xs text-rd font-bold h-8 p-0">
          <div className="flex flex-col h-full justify-between items-start">
            <span className="text-rd">
              {totalMinusSum ? (
                totalMinusSum.toFixed(2)
              ) : (
                <div className="h-1/2" />
              )}
            </span>
            <span className="text-bl">
              {totalPlusSum ? (
                totalPlusSum.toFixed(2)
              ) : (
                <div className="h-1/2" />
              )}
            </span>
          </div>
        </TableCell>
        <TableCell />
        <TableCell className="text-xs text-rd font-bold h-8 p-0">
          <div className="flex flex-col h-full ">
            <span className="text-rd">
              {totalCreditStartSum ? (
                totalCreditStartSum.toFixed(2)
              ) : (
                <div className="h-1/2" />
              )}
            </span>
            <span className="text-bl">
              {totalDebitStartSum ? (
                totalDebitStartSum.toFixed(2)
              ) : (
                <div className="h-1/2" />
              )}
            </span>
          </div>
        </TableCell>

        {monthDays.map((_, dayIndex) => {
          const dayTotalPlus = arrayRows.reduce((acc, row) => {
            const r = value?.[row];
            return acc + (Number(r?.plus?.[dayIndex]) || 0);
          }, 0);

          const dayTotalMinus = arrayRows.reduce((acc, row) => {
            const r = value?.[row];
            return acc + (Number(r?.minus?.[dayIndex]) || 0);
          }, 0);

          return (
            <TableCell key={dayIndex} className="text-end text-xs h-8 p-0">
              <div className="flex flex-col h-full">
                <span className="text-rd">
                  {dayTotalMinus ? (
                    dayTotalMinus.toFixed(2)
                  ) : (
                    <div className="h-1/2" />
                  )}
                </span>
                <span className="text-bl">
                  {dayTotalPlus ? (
                    dayTotalPlus.toFixed(2)
                  ) : (
                    <div className="h-1/2" />
                  )}
                </span>
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </TableBody>
  );
}
