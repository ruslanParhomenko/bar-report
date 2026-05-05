"use client";

import { PriceListType } from "@/app/actions/data-constants/data-price-list";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";

const COLUMNS_1 = ["вермут", "настойка", "водка", "вино"];
const COLUMNS_2 = ["пиво", "виски", "коньяк"];
const COLUMNS_3 = ["джин", "ликер", "ром", "текила", "шампанское", "сигары"];
const COLUMNS_4 = ["коктейль", "безалкогольное", "энергетик", "прочее"];

const COLUMN_GROUPS = [COLUMNS_1, COLUMNS_2, COLUMNS_3, COLUMNS_4];

function calcMarkup(
  cost: number | null,
  price: number,
  currency: number,
): number | null {
  if (!cost) return null;
  const priceMdl = Number(price) * Number(currency);
  return Math.round(((priceMdl - cost) / cost) * 100);
}

function CategoryBlock({
  category,
  list,
  currency,
}: {
  category: string;
  list: PriceListType["priceList"][string];
  currency: number;
}) {
  const { isAdmin } = useAbility();
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={4} className="text-bl font-bold capitalize">
          {category}
        </TableCell>
      </TableRow>
      {list.map((item, index) => {
        const markup = calcMarkup(item.cost, item["price-chips"], currency);
        return (
          <TableRow key={index} className="[&>td]:py-1.5 [&>td]:text-xs">
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-rd font-bold">
              {item["price-chips"]}
            </TableCell>
            <TableCell>{item["price-chips"] * currency}</TableCell>
            <TableCell>
              {markup !== null && isAdmin ? `${markup}%` : "-"}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export function PriceListTable({ data }: { data: PriceListType }) {
  const currency = data.currency;
  const priceList = data.priceList || {};

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
      {COLUMN_GROUPS.map((group, groupIndex) => (
        <Table key={groupIndex}>
          {group.map((category) => {
            const list = priceList[category];
            if (!list) return null;
            return (
              <CategoryBlock
                key={category}
                category={category}
                list={list}
                currency={currency}
              />
            );
          })}
        </Table>
      ))}
    </div>
  );
}
