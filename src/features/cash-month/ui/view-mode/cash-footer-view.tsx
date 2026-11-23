import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";

export default function CashFooterViews({
  data,
}: {
  data: GetCashData | null;
}) {
  const { monthDays } = useMonthDays();
  const value = data?.cashData.rowCashData;

  const start_241 = data?.cashData.start_241 || 0;
  const z_531 = Number(data?.cashData.z_531 || 0).toFixed(2);
  const ao_532 = Number(data?.cashData.ao_532 || 0).toFixed(2);

  const totalCashBar = value?.cash
    ? Object.values(value.cash)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalCashBarBuffet = value?.cashBuffet
    ? Object.values(value.cashBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalVisaBar = value?.visaBarByDay
    ? Object.values(value.visaBarByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalVisaBarBuffet = value?.visaBarByDayBuffet
    ? Object.values(value.visaBarByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalBank = value?.bankCollectionByDay
    ? Object.values(value.bankCollectionByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalBankBuffet = value?.bankCollectionByDayBuffet
    ? Object.values(value.bankCollectionByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;
  const totalNbmCollection = value?.nbmCollectionByDay
    ? Object.values(value.nbmCollectionByDay)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalNbmCollectionBuffet = value?.nbmCollectionByDayBuffet
    ? Object.values(value.nbmCollectionByDayBuffet)
        .reduce((acc, val) => acc + Number(val || 0), 0)
        .toFixed(2)
    : 0;

  const totalNbmColl =
    Number(totalNbmCollection) + Number(totalNbmCollectionBuffet);

  const remainingCash =
    Number(totalCashBar) -
    Number(totalVisaBar) -
    Number(totalBank) -
    Number(totalNbmCollection);

  const remainingCashBuffet =
    Number(totalCashBarBuffet) -
    Number(totalVisaBarBuffet) -
    Number(totalBankBuffet) -
    Number(totalNbmCollectionBuffet);

  const finalCash =
    Number(start_241) +
    Number(totalNbmCollection ?? 0) -
    Number(z_531) -
    Number(ao_532);

  return (
    <TableFooter>
      <TableRow className="h-8 border-0 [&>td]:py-0 [&>td]:text-xs">
        <TableCell
          className="text-bl pr-2 text-right text-xs font-bold"
          colSpan={monthDays.length}
        >
          <div className="text-gn flex items-center justify-center gap-4">
            <div>
              <span className="font-bold">remaining cash:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {remainingCash.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="font-bold">remaining cash buffet:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {remainingCashBuffet.toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={monthDays.length}>
          <div className="text-gn flex items-center justify-center gap-4">
            <div>
              <span className="font-bold">start-241:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">{start_241}</span>
            </div>
            <div>
              <span className="font-bold">832:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {totalNbmColl ?? 0}
              </span>
            </div>
            <div>
              <span className="font-bold">z-531:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">{z_531}</span>
            </div>
            <div>
              <span className="font-bold">ao-532:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">{ao_532}</span>
            </div>
            <div>
              <span className="font-bold">final_241:</span>
              <span className="ml-4 h-7 px-2 py-1.5 text-xs">
                {finalCash.toFixed(2)}
              </span>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
