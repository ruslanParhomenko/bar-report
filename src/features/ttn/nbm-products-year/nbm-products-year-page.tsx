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
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="[&>td]:py-0 [&>td]:text-xs">
          <TableCell className="w-10" />
          <TableCell className="w-36 text-center" />
          {MONTHS.map((month) => (
            <TableCell key={month} className="w-24 text-center text-xs">
              <div className="text-[10px]">{month}</div>
              <div className="flex flex-row items-center justify-between px-2 text-[12px]">
                <span>+</span>
                <span>r</span>
                <span>f</span>
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
                className="group hover:bg-accent [&>td]:py-px [&>td]:text-[0.7rem]"
              >
                <TableCell className="text-muted-foreground w-8">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-bl group-hover:text-rd w-36">
                  {product.toLocaleLowerCase()}
                </TableCell>
                {MONTHS.map((month) => {
                  const dataByProduct = data?.find((item) => item.id === month)
                    ?.dataProducts?.rowProducts?.[product];

                  const arrival = dataByProduct?.arrival.reduce(
                    (acc, cur) => acc + +cur,
                    0,
                  );

                  const remain = dataByProduct?.remain || 0;

                  const final = Number(arrival || 0) - Number(remain || 0);
                  return (
                    <TableCell
                      key={month}
                      className="border-x text-center text-xs"
                    >
                      <div className="flex w-full flex-row items-center justify-between">
                        <span className="group-hover:text-rd w-10 text-start font-bold">
                          {arrival}
                        </span>
                        <span className="w-10 text-center">{remain || ""}</span>
                        <span className="text-rd w-10 text-end">
                          {final || ""}
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
