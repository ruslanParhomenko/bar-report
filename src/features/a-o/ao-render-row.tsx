import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";
import { AOFormType } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { handleMultiTableNavigation } from "@/utils/handleMultiTableNavigation";
import { handleTableNavigation } from "@/utils/handleTableNavigation";

export type arrayRowsType = {
  key: keyof AOFormType["rowAOData"];
  label: string;
  colorBg: string;
  colorText: string;
  type: "input" | "text";
};

type RenderRowProps = {
  nameLabel?: string;
  arrayRows: arrayRowsType[];
  form: UseFormReturn<AOFormType>;
  monthDays: { day: number; weekday: string }[];
  isDisabled?: boolean;
};
export default function AoRenderRow({
  nameLabel,
  arrayRows,
  form,
  monthDays,
  isDisabled,
}: RenderRowProps) {
  const { register } = form;
  const value = useWatch({
    control: form.control,
    name: "rowAOData",
  });

  const totalByDay = monthDays.map((_, dayIndex) => {
    return arrayRows.reduce((acc, row) => {
      const rowData = value?.[row.key as keyof AOFormType["rowAOData"]];
      if (!rowData) return acc;

      const val = rowData[dayIndex];
      const num = Number(val);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  });
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={monthDays.length + 2}
          className="h-12 border-0 text-black text-xs"
        >
          {nameLabel}
        </TableCell>
      </TableRow>
      {arrayRows.map((row, _index) => {
        const currentRow = _index;
        const total = (
          value?.[row.key as keyof AOFormType["rowAOData"]] as string[]
        )
          ?.reduce((acc: number, val: string) => acc + Number(val || 0), 0)
          .toFixed(2);
        return (
          <TableRow key={row.key}>
            <TableCell
              colSpan={2}
              className={cn(
                "font-medium sticky left-0 p-0 text-start truncate",
                row.colorText
              )}
            >
              {row.label}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              return (
                <TableCell key={dayIndex} className="p-0 text-center border-x">
                  <input
                    type="text"
                    disabled={isDisabled}
                    data-row={currentRow}
                    data-col={dayIndex}
                    {...register(
                      `rowAOData.${row.key}.${dayIndex}` as FieldPath<AOFormType>
                    )}
                    className={cn(
                      "border-0  p-0 h-7 text-center  shadow-none text-xs w-12",
                      row.colorText
                    )}
                    onKeyDown={handleMultiTableNavigation}
                  />
                </TableCell>
              );
            })}
            <TableCell className="text-rd font-bold">
              {row.type === "input" && total}
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow className="border-0">
        <TableCell colSpan={2} className="p-0 text-start"></TableCell>
        {totalByDay.map((total, index) => (
          <TableCell key={index} className="p-0 text-center text-xs text-bl">
            {total > 0 ? total.toFixed(0) : ""}
          </TableCell>
        ))}
        <TableCell className="p-0 text-center">
          {totalByDay.reduce((acc, t) => acc + t, 0).toFixed(2)}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
