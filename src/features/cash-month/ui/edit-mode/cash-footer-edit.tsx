"use client";

import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { CashForm } from "@/features/cash-month/model/schema";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";

type Values = (string | number | null | undefined)[] | undefined;

const round2 = (n: number) => Math.round(n * 100) / 100;
const sum = (values?: Values) =>
  round2(values?.reduce<number>((acc, v) => acc + Number(v || 0), 0) ?? 0);

function Item({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="font-bold">{label}:</span>
      <span className="ml-4 h-7 px-2 py-1.5 text-xs">{value}</span>
    </div>
  );
}

function NumberInput({ name }: { name: string }) {
  const { register } = useFormContext<CashForm>();
  return (
    <div>
      <span className="font-bold">{name}:</span>
      <input
        type="text"

        {...register(name as keyof CashForm)}
        className={cn(
          "bg-accent ml-4 h-7 w-24 border-0 p-0 text-center text-xs shadow-none",
        )}
      />
    </div>
  );
}

export default function CashFooterEdit() {
  const { monthDays } = useMonthDays();

  const { control } = useFormContext<CashForm>();

  const [rows, start241, z531, ao532] = useWatch({
    control,
    name: ["rowCashData", "start_241", "z_531", "ao_532"],
  });

  const cash = sum(rows?.cash);
  const cashBuffet = sum(rows?.cashBuffet);
  const visa = sum(rows?.visaBarByDay);
  const visaBuffet = sum(rows?.visaBarByDayBuffet);
  const bank = sum(rows?.bankCollectionByDay);
  const bankBuffet = sum(rows?.bankCollectionByDayBuffet);
  const nbm = sum(rows?.nbmCollectionByDay);
  const nbmBuffet = sum(rows?.nbmCollectionByDayBuffet);

  const totalNbm = nbm + nbmBuffet;

  const remainingCash = cash - visa - bank - nbm;
  const remainingCashBuffet = cashBuffet - visaBuffet - bankBuffet - nbmBuffet;
  const finalCash = Number(start241) + totalNbm - Number(z531) - Number(ao532);

  return (
    <TableFooter>
      <TableRow className="h-8 border-0 [&>td]:py-0 [&>td]:text-xs">
        <TableCell
          className="text-bl pr-2 text-right text-xs font-bold"
          colSpan={monthDays.length}
        >
          <div className="text-gn flex items-center justify-center gap-4">
            <Item label="remaining cash" value={remainingCash.toFixed(2)} />
            <Item
              label="remaining cash buffet"
              value={remainingCashBuffet.toFixed(2)}
            />
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={monthDays.length}>
          <div className="text-gn flex items-center justify-center gap-4">
            <NumberInput name="start_241" />
            <Item label="832" value={totalNbm} />
            <NumberInput name="z_531" />
            <Item label="ao-532" value={ao532} />
            <Item label="final_241" value={finalCash} />
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
