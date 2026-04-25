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
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FIN_CASH_ITEMS_LIST } from "./constants";

import { createFin, GetFinData } from "@/app/actions/fin-cash/fin-action";
import EditButton from "@/components/buttons/edit-button";
import SaveButton from "@/components/buttons/save-button";
import { Form } from "@/components/ui/form";
import { useAbility } from "@/providers/ability-provider";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
import { toast } from "sonner";

const VAT_PLUS_KEYS = ["nbm-vat", "bar-vat"];
const VAT_MINUS_KEYS = ["ttn-vat"];
const TAX_KEYS = ["225", "vat-bay", "534.2-12%", "533.2-9%", "533.1-24%"];

export default function FinPage({
  finCashData,
  year,
}: {
  finCashData: GetFinData | null;
  year: string;
}) {
  const form = useForm<FinForm>({
    resolver: zodResolver(finCashSchema),
    defaultValues: defaultFinCashForm,
  });

  const { isAdmin } = useAbility();
  const isDisabled = !isAdmin;

  const [isEdit, setIsEdit] = useState(false);

  const FIXED_COLUMNS = ["НДС", "НАЛОГ"];
  const ALL_COLUMNS = [...FIXED_COLUMNS, ...FIN_CASH_ITEMS_LIST];

  const onSubmit: SubmitHandler<FinForm> = async (data) => {
    const formattedData = {
      finData: data,
      year,
    };
    await createFin(formattedData);
    toast.success("Форма сохранена успешно!");
  };

  useEffect(() => {
    if (finCashData) {
      form.reset(finCashData.finData);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Table className="mt-4 md:table-fixed">
          <TableHeader>
            <TableRow className="border-0!">
              <TableHead className="bg-background sticky left-0">
                <div className="flex items-center justify-center gap-3">
                  <EditButton
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    disabled={isDisabled}
                  />

                  <SaveButton isEdit={isEdit} disabled={!isEdit} />
                </div>
              </TableHead>
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
              const { nds, tax } = getRowCalculations(month);
              const row = values?.[month] ?? [];

              return (
                <TableRow key={month} className="border-0 [&>td]:p-0">
                  <TableCell className="text-bl bg-background sticky left-0 px-4 text-xs font-bold md:bg-transparent">
                    {month}
                  </TableCell>

                  <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
                    {nds.toFixed(2)}
                  </TableCell>
                  <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
                    {tax.toFixed(2)}
                  </TableCell>

                  {FIN_CASH_ITEMS_LIST.map((itemName, colIndex) => (
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
                {ndsTotal.toFixed(2)}
              </TableCell>
              <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
                {taxTotal.toFixed(2)}
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
                {ndsAverage.toFixed(2)}
              </TableCell>
              <TableCell className="border-muted-foreground/20 border text-center text-xs font-bold">
                {taxAverage.toFixed(2)}
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
      </form>
    </Form>
  );
}
