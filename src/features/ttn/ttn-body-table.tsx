import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { SuppliersFormType, SuppliersFormTypeInput } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";

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

        return (
          <TableRow key={row}>
            <TableCell className="text-xs p-0 pr-1  border-r">
              <div className="w-30 flex  items-center justify-between">
                <div className="flex flex-col  items-end">
                  <span className="text-rd">{minusTotal.toFixed(2)}</span>
                  <span className="text-bl">{plusTotal.toFixed(2)}</span>
                </div>
                <span className="font-bold">{finalTotal.toFixed(2)}</span>
              </div>
            </TableCell>

            <TableCell className="text-start p-0 pl-1">
              <span className="truncate font-bold ">{row}</span>
            </TableCell>
            <TableCell className="text-center text-xs w-16 p-0  border-l">
              <input
                {...register(
                  `rowSuppliers.${row}.start` as FieldPath<SuppliersFormTypeInput>
                )}
                data-row={rowIndex * 2}
                data-col={-1}
                className="h-full w-14 text-center border-0 m-0 box-border p-0 leading-none"
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
                    className="h-4 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none pr-0.5 text-rd"
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
                    className="h-4 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none pr-0.5 text-bl"
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

      <TableRow className="sticky bottom-0 bg-background">
        <TableCell colSpan={3} />

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
              <div className="flex flex-col h-full justify-between">
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
