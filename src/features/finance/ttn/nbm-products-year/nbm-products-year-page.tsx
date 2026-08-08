"use client";
import { GetNbmProductsData } from "@/app/actions/ttn/ttn-nbm-products-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MONTHS } from "@/utils/get-month-days";

export default function NbmProductsYearPage({
  data,
}: {
  data: GetNbmProductsData[] | null;
}) {
  const allProducts = [
    ...new Set(
      (data ?? [])
        .flatMap(({ dataProducts }) => dataProducts)
        .flatMap(({ rowProducts }) => Object.keys(rowProducts)),
    ),
  ];
  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow className="[&>td]:py-0 [&>td]:text-xs">
          <TableCell className="w-10" />
          <TableCell className="w-36 text-center" />
          {MONTHS.map((month) => (
            <TableCell key={month} className="w-18 text-center text-xs">
              <div className="text-[10px]">{month}</div>
              <div className="flex flex-row items-center justify-center gap-10 text-[12px]">
                <span>+</span>
                <span>-</span>
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allProducts
          .sort((a, b) => a.localeCompare(b))
          .map((product, idx) => {
            return (
              <TableRow
                key={idx + product}
                className="group hover:bg-accent [&>td]:py-px [&>td]:text-[0.75rem]"
              >
                <TableCell className="text-muted-foreground w-8">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-bl group-hover:text-rd bg-background sticky left-0 w-38 md:bg-transparent">
                  {product.toLocaleLowerCase()}
                </TableCell>
                {MONTHS.map((month, idx) => {
                  const dataProductsPrevMonth = data?.find(
                    (item) => item.id === MONTHS[idx - 1],
                  )?.dataProducts?.rowProducts?.[product];

                  const dataByProduct = data?.find((item) => item.id === month)
                    ?.dataProducts?.rowProducts?.[product];

                  const arrival =
                    dataByProduct?.arrival.reduce(
                      (acc, cur) => acc + +cur,
                      0,
                    ) || 0;

                  const prev = Number(dataProductsPrevMonth?.remain || 0);
                  const remain = Number(dataByProduct?.remain || 0);

                  const utilization = prev + arrival - remain;

                  return (
                    <TableCell
                      key={month}
                      className="border-x text-center text-xs"
                    >
                      <div className="flex w-full flex-row items-center justify-center gap-4">
                        <span className="group-hover:text-rd w-8 px-2 text-start font-bold">
                          {arrival || ""}
                        </span>
                        <span className="text-rd w-8 px-2 text-end">
                          {utilization || ""}
                        </span>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
