import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { SuppliersFormType } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";

export default function TTNBodyTable({
  arrayRows,
  monthDays,
  form,
  isDisabled,
}: {
  arrayRows: string[];
  monthDays: ReturnType<typeof import("@/utils/getMonthDays").getMonthDays>;
  form: UseFormReturn<SuppliersFormType>;
  isDisabled?: boolean;
}) {
  const { register } = form;
  const value = useWatch({
    control: form.control,
    name: "rowSuppliers",
  });

  const sum = (arr?: string[]) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v) || 0), 0);

  return (
    <TableBody>
      {arrayRows.map((row, rowIndex) => {
        const rowData = value?.[row];
        const minusTotal = sum(rowData?.minus);
        const plusTotal = sum(rowData?.plus);
        const startAmount = Number(rowData?.start || 0);
        const finalTotal = startAmount + minusTotal + plusTotal;

        return (
          <TableRow key={row} className="h-6">
            <TableCell className="text-start p-0   h-6">
              <span className="truncate w-full">{row}</span>
            </TableCell>
            <TableCell className="text-center text-xs w-16 p-0 h-6 border-l">
              <input
                {...register(
                  `rowSuppliers.${row}.start` as FieldPath<SuppliersFormType>
                )}
                data-row={rowIndex * 2}
                data-col={-1}
                className="h-full w-full text-center border-0 m-0 box-border p-0 leading-none"
                onKeyDown={(e) => handleTableNavigation(e, rowIndex * 2, -1)}
                disabled={isDisabled}
              />
            </TableCell>
            {monthDays.map((_, dayIndex) => (
              <TableCell key={dayIndex} className="p-0! border-x h-6!">
                <div className="flex flex-col h-6 p-0">
                  <input
                    {...register(
                      `rowSuppliers.${row}.minus.${dayIndex}` as FieldPath<SuppliersFormType>
                    )}
                    data-row={rowIndex * 2}
                    data-col={dayIndex}
                    className="h-1/2 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none pr-0.5 text-rd"
                    onKeyDown={(e) =>
                      handleTableNavigation(e, rowIndex * 2, dayIndex)
                    }
                    disabled={isDisabled}
                  />
                  <input
                    {...register(
                      `rowSuppliers.${row}.plus.${dayIndex}` as FieldPath<SuppliersFormType>
                    )}
                    data-row={rowIndex * 2 + 1}
                    data-col={dayIndex}
                    className="h-1/2 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none pr-0.5 text-bl"
                    onKeyDown={(e) =>
                      handleTableNavigation(e, rowIndex * 2 + 1, dayIndex)
                    }
                    disabled={isDisabled}
                  />
                </div>
              </TableCell>
            ))}

            <TableCell className="text-xs h-6 p-0 px-1 w-14 border-r">
              <div className="flex flex-col p-0 items-end">
                <span className="text-rd">{minusTotal.toFixed(2)}</span>
                <span className="text-bl">{plusTotal.toFixed(2)}</span>
              </div>
            </TableCell>

            <TableCell className="text-right  p-0 px-1 w-14.5 h-6 text-xs font-bold">
              {finalTotal.toFixed(2)}
            </TableCell>
          </TableRow>
        );
      })}

      <TableRow>
        <TableCell colSpan={2} />

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

        <TableCell colSpan={3} />
      </TableRow>
    </TableBody>
  );
}
