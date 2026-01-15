import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { SuppliersFormTypeInput } from "./schema";
import { handleTableNavigation } from "@/utils/handleTableNavigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

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

  const currentDay = new Date().getDate();

  const sum = (arr?: Array<string | undefined>) =>
    (arr ?? []).reduce((acc, v) => acc + (Number(v ?? 0) || 0), 0);

  useEffect(() => {
    arrayRows.forEach((row) => {
      const rowData = value?.[row];
      if (!rowData) return;

      const minusTotal = sum(rowData.minus);
      const plusTotal = sum(rowData.plus);
      const startAmount = Number(rowData.start || 0);
      const finalTotal = startAmount + minusTotal + plusTotal;

      form.setValue(`rowSuppliers.${row}.final`, finalTotal.toFixed(2), {
        shouldDirty: false,
        shouldTouch: false,
      });
    });
  }, [
    value?.rowSuppliers?.minus,
    value?.rowSuppliers?.plus,
    value?.rowSuppliers?.start,
    arrayRows,
    form,
  ]);

  return (
    <TableBody>
      {arrayRows.map((row, rowIndex) => {
        const rowData = value?.[row];
        const minusTotal = sum(rowData?.minus);
        const plusTotal = sum(rowData?.plus);

        const isRowByCurrentDay = value?.[row]?.plus?.[currentDay - 1];

        const classNameInput =
          "h-4 w-full text-end text-xs border-0 p-0 m-0 box-border leading-none px-0.5";

        return (
          <TableRow key={row}>
            <TableCell className="text-xs p-0 pr-0.5  border-r">
              <div className="w-30 grid grid-cols-2 gap-1">
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
                <div className="flex items-center">
                  <input
                    {...register(
                      `rowSuppliers.${row}.final` as FieldPath<SuppliersFormTypeInput>
                    )}
                    className={cn(classNameInput, "text-gn")}
                    disabled={isDisabled}
                  />
                </div>
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
            <TableCell className="p-0 pr-0.5 border-l text-xs">
              <input
                {...register(
                  `rowSuppliers.${row}.start` as FieldPath<SuppliersFormTypeInput>
                )}
                className={cn(classNameInput)}
                disabled={isDisabled}
              />
            </TableCell>
            {monthDays.map((_, dayIndex) => (
              <TableCell key={dayIndex} className="p-0 border-x">
                <div className="flex flex-col h-8">
                  <input
                    {...register(
                      `rowSuppliers.${row}.minus.${dayIndex}` as FieldPath<SuppliersFormTypeInput>
                    )}
                    data-row={rowIndex * 2}
                    data-col={dayIndex}
                    className={cn(classNameInput, "text-rd")}
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
                    className={cn(classNameInput, "text-bl")}
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
    </TableBody>
  );
}
