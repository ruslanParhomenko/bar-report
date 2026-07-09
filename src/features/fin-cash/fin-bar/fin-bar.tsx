"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  defaultFinCashForm,
  finCashSchema,
  FinForm,
} from "@/features/fin-cash/schema";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { createFinBar, GetFinData } from "@/app/actions/fin-cash/fin-action";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { toast } from "sonner";
import { FIN_BAR_ITEMS_LIST } from "../constants";

const VAT_PLUS_KEYS = ["nbm-vat", "bar-vat"];
const VAT_MINUS_KEYS = ["ttn-vat"];
const TAX_KEYS = ["225", "vat-bay", "534.2-12%", "533.2-9%", "533.1-24%"];

export default function FinBar({
  finBarData,
  year,
}: {
  finBarData: GetFinData | null;
  year: string;
}) {
  const form = useForm<FinForm>({
    resolver: zodResolver(finCashSchema),
    defaultValues: defaultFinCashForm,
  });

  const { isEdit, setIsEdit } = useEdit();

  const ALL_COLUMNS = ["total", ...FIN_BAR_ITEMS_LIST];

  const onSubmit: SubmitHandler<FinForm> = async (data) => {
    const formattedData = {
      finData: data,
      year,
    };
    await createFinBar(formattedData);
    toast.success("Форма сохранена успешно!");
    setIsEdit(false);
  };

  useEffect(() => {
    if (finBarData) {
      form.reset(finBarData.finData);
    } else {
      const newRowFinCash = Object.fromEntries(
        MONTHS.map((month) => [
          month,
          FIN_BAR_ITEMS_LIST.map((item) => ({ name: item, value: "" })),
        ]),
      );

      form.reset({
        ...defaultFinCashForm,
        rowFinCashMonth: newRowFinCash,
      });
    }
  }, [finBarData]);

  const values = form.watch("rowFinCashMonth");

  const getNumber = (val: any) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const getRowCalculations = (month: string) => {
    const row = values?.[month] ?? [];
    const map: Record<string, string> = Object.fromEntries(
      row.map((i) => [i.name, i.value]),
    );

    const totals = FIN_BAR_ITEMS_LIST.filter((item) => item !== "521").reduce(
      (sum, key) => sum + getNumber(map[key]),
      0,
    );
    return totals;
  };

  const columnTotals = useMemo(() => {
    return FIN_BAR_ITEMS_LIST.map((_, colIndex) =>
      MONTHS.reduce((sum, month) => {
        const value = values?.[month]?.[colIndex]?.value;
        return sum + getNumber(value);
      }, 0),
    );
  }, [values]);

  const totalsTotal = useMemo(
    () => MONTHS.reduce((sum, month) => sum + getRowCalculations(month), 0),
    [values],
  );

  const columnAverages = useMemo(() => {
    return FIN_BAR_ITEMS_LIST.map((_, colIndex) => {
      let sum = 0;
      let count = 0;
      MONTHS.forEach((month) => {
        const value = values?.[month]?.[colIndex]?.value;
        if (value !== "" && value !== null && value !== undefined) {
          const num = parseFloat(value);
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      });
      return count > 0 ? sum / count : 0;
    });
  }, [values]);

  const totalsAverage = useMemo(() => {
    const values = MONTHS.map((month) => getRowCalculations(month));
    const nonZero = values.filter((v) => v !== 0);
    return nonZero.length > 0
      ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length
      : 0;
  }, [values]);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="mt-4 md:table-fixed">
        <TableHeader>
          <TableRow className="border-0!">
            <TableHead className="bg-background sticky left-0"></TableHead>
            {ALL_COLUMNS.map((col) => (
              <TableHead
                key={col}
                className="text-bl text-center text-xs font-bold"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {MONTHS.map((month, rowIndex) => {
            const totals = getRowCalculations(month);
            return (
              <TableRow key={month} className="[&>td]:p-0">
                <TableCell className="text-bl bg-background sticky left-0 px-4 text-center text-xs font-bold md:bg-transparent">
                  {month}
                </TableCell>

                <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
                  {totals.toFixed(2)}
                </TableCell>

                {FIN_BAR_ITEMS_LIST.map((itemName, colIndex) => (
                  <TableCell
                    key={itemName}
                    className="border-muted-foreground/20 border"
                  >
                    <input
                      {...form.register(
                        `rowFinCashMonth.${month}[${colIndex}].value`,
                      )}
                      className="m-0 h-8 w-full cursor-pointer p-0 text-center text-xs font-bold"
                      data-row={rowIndex}
                      data-col={colIndex}
                      onKeyDown={handleMultiTableNavigation}
                      disabled={!isEdit}
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow className="text-bl border-0">
            <TableCell className="bg-background sticky left-0 pl-4! text-xs font-bold">
              Итого
            </TableCell>
            <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
              {totalsTotal.toFixed(2)}
            </TableCell>

            {columnTotals.map((total, index) => (
              <TableCell
                key={index}
                className="border text-center text-xs font-bold"
              >
                {total.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="text-muted-foreground border-0">
            <TableCell className="bg-background sticky left-0 pl-4! text-xs font-bold">
              Среднее
            </TableCell>
            <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
              {totalsAverage.toFixed(2)}
            </TableCell>

            {columnAverages.map((avg, index) => (
              <TableCell
                key={index}
                className="border text-center text-xs font-bold"
              >
                {avg.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </FormWrapper>
  );
}
