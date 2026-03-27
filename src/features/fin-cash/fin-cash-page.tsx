"use client";
import {
  defaultFinCashForm,
  FinCashForm,
  finCashSchema,
} from "@/features/fin-cash/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import FormInput from "@/components/wrapper/form";
import { MONTHS } from "@/utils/get-month-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FIN_CASH_ITEMS_LIST } from "./constants";
import { useEffect, useMemo } from "react";
import {
  GetFinCashRowByYear,
  saveFinCashForm,
} from "@/app/actions/fin-cash/fin-cash-action";
import { toast } from "sonner";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";

const VAT_PLUS_KEYS = ["nbm-vat", "bar-vat"];
const VAT_MINUS_KEYS = ["ttn-vat"];
const TAX_KEYS = ["225", "vat-bay", "534.2-12%", "533.2-9%", "533.1-24%"];

export default function FinCashPage({
  finCashData,
  year,
}: {
  finCashData: GetFinCashRowByYear | null;
  year: string;
}) {
  const form = useForm<FinCashForm>({
    resolver: zodResolver(finCashSchema),
    defaultValues: defaultFinCashForm,
  });

  const FIXED_COLUMNS = ["НДС", "НАЛОГ"];
  const ALL_COLUMNS = [...FIXED_COLUMNS, ...FIN_CASH_ITEMS_LIST];

  const submit: SubmitHandler<FinCashForm> = async (data) => {
    await saveFinCashForm({ form_data: data, year });
    toast.success("Форма сохранена успешно!");
  };

  useEffect(() => {
    if (finCashData) {
      form.reset(finCashData.form_data);
    } else {
      const newRowFinCash = Object.fromEntries(
        MONTHS.map((month) => [
          month,
          FIN_CASH_ITEMS_LIST.map((item) => ({ name: item, value: "" })),
        ]),
      );

      form.reset({
        ...defaultFinCashForm,
        rowFinCashMonth: newRowFinCash,
      });
    }
  }, [finCashData]);

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

    const nds =
      VAT_PLUS_KEYS.reduce((sum, key) => sum + getNumber(map[key]), 0) -
      VAT_MINUS_KEYS.reduce((sum, key) => sum + getNumber(map[key]), 0);
    const tax = TAX_KEYS.reduce((sum, key) => sum + getNumber(map[key]), 0);

    return { nds, tax };
  };

  const columnTotals = useMemo(() => {
    return FIN_CASH_ITEMS_LIST.map((_, colIndex) =>
      MONTHS.reduce((sum, month) => {
        const value = values?.[month]?.[colIndex]?.value;
        return sum + getNumber(value);
      }, 0),
    );
  }, [values]);

  const ndsTotal = useMemo(
    () => MONTHS.reduce((sum, month) => sum + getRowCalculations(month).nds, 0),
    [values],
  );
  const taxTotal = useMemo(
    () => MONTHS.reduce((sum, month) => sum + getRowCalculations(month).tax, 0),
    [values],
  );

  const columnAverages = useMemo(() => {
    return FIN_CASH_ITEMS_LIST.map((_, colIndex) => {
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

  const ndsAverage = useMemo(
    () =>
      MONTHS.reduce((sum, month) => sum + getRowCalculations(month).nds, 0) /
      MONTHS.length,
    [values],
  );
  const taxAverage = useMemo(
    () =>
      MONTHS.reduce((sum, month) => sum + getRowCalculations(month).tax, 0) /
      MONTHS.length,
    [values],
  );

  return (
    <FormInput form={form} onSubmit={submit}>
      <Table className="md:table-fixed">
        <TableHeader>
          <TableRow className="border-0!">
            <TableHead className="sticky left-0 bg-background" />
            {ALL_COLUMNS.map((col) => (
              <TableHead
                key={col}
                className="text-bl text-xs font-bold text-center"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {MONTHS.map((month, rowIndex) => {
            const { nds, tax } = getRowCalculations(month);
            const row = values?.[month] ?? [];

            return (
              <TableRow key={month} className="[&>td]:p-0 border-0">
                <TableCell className="text-bl text-xs font-bold pl-4! sticky left-0 bg-background">
                  {month}
                </TableCell>

                <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
                  {nds.toFixed(2)}
                </TableCell>
                <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
                  {tax.toFixed(2)}
                </TableCell>

                {FIN_CASH_ITEMS_LIST.map((itemName, colIndex) => (
                  <TableCell
                    key={itemName}
                    className="border border-muted-foreground/20"
                  >
                    <input
                      {...form.register(
                        `rowFinCashMonth.${month}[${colIndex}].value`,
                      )}
                      className="h-8 p-0 m-0 text-center w-full cursor-pointer text-xs font-bold"
                      data-row={rowIndex}
                      data-col={colIndex}
                      onKeyDown={handleMultiTableNavigation}
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow className="border-0 text-bl">
            <TableCell className="sticky left-0 bg-background font-bold text-xs pl-4!">
              Итого
            </TableCell>
            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {ndsTotal.toFixed(2)}
            </TableCell>
            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {taxTotal.toFixed(2)}
            </TableCell>
            {columnTotals.map((total, index) => (
              <TableCell
                key={index}
                className="text-center font-bold text-xs border"
              >
                {total.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="border-0 text-muted-foreground">
            <TableCell className="sticky left-0 bg-background font-bold text-xs pl-4!">
              Среднее
            </TableCell>
            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {ndsAverage.toFixed(2)}
            </TableCell>
            <TableCell className="border border-muted-foreground/20 text-center text-xs font-bold">
              {taxAverage.toFixed(2)}
            </TableCell>
            {columnAverages.map((avg, index) => (
              <TableCell
                key={index}
                className="text-center font-bold text-xs border"
              >
                {avg.toFixed(2)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </FormInput>
  );
}
