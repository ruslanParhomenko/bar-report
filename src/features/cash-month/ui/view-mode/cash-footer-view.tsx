import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { GetCashData } from "@/features/cash-month/model/type";
import { useMonthDays } from "@/hooks/use-month-days";

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

export default function CashFooterViews({
  data,
}: {
  data: GetCashData | null;
}) {
  const { monthDays } = useMonthDays();
  const rows = data?.cashData.rowCashData;

  const start241 = Number(data?.cashData.start_241 || 0);
  const z531 = Number(data?.cashData.z_531 || 0);
  const ao532 = Number(data?.cashData.ao_532 || 0);

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
  const finalCash = start241 + totalNbm - z531 - ao532;

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
            <Item label="start-241" value={start241} />
            <Item label="832" value={totalNbm} />
            <Item label="z-531" value={z531.toFixed(2)} />
            <Item label="ao-532" value={ao532.toFixed(2)} />
            <Item label="final_241" value={finalCash.toFixed(2)} />
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
