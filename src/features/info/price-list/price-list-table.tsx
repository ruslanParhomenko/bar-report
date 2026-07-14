"use client";

import { PriceListType } from "@/app/actions/data-constants/data-price-list";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";

const COLUMNS_1 = ["вермут", "настойка", "водка", "вино", "пиво"];
const COLUMNS_2 = ["виски", "коньяк", "коктейль", "джин", "ликер"];
const COLUMNS_3 = [
  "ром",
  "текила",
  "шампанское",
  "сигары",
  "безалкогольное",
  "энергетик",
  "прочее",
];

const COLUMNS_CUCINA_1 = ["breakfast", "salads", "soups"];
const COLUMNS_CUCINA_2 = ["second_courses", "side_dishes"];
const COLUMNS_CUCINA_3 = ["desserts", "snacks"];

const COLUMN_GROUPS = [COLUMNS_1, COLUMNS_2, COLUMNS_3];

const COLUMN_GROUPS_CUCINA = [
  COLUMNS_CUCINA_1,
  COLUMNS_CUCINA_2,
  COLUMNS_CUCINA_3,
];

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
  currency: number | undefined;
}) {
  const { isAdmin } = useAbility();
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={4} className="text-bl py-1 font-bold capitalize">
          {category}
        </TableCell>
      </TableRow>
      {list.map((item, index) => {
        const markup = calcMarkup(
          item.cost,
          item["price-chips-new"],
          currency || 0,
        );
        return (
          <TableRow key={index} className="[&>td]:py-1.5 [&>td]:text-xs">
            <TableCell className="px-0 md:px-1 print:w-30">
              {item.name}
            </TableCell>
            <TableCell>{isAdmin && item.cost}</TableCell>
            <TableCell className="text-muted-foreground">
              {item["price-chips"]}
            </TableCell>
            <TableCell className="text-rd font-bold">
              {item["price-chips-new"]}
            </TableCell>
            <TableCell>{item["price-chips-new"] * (currency || 0)}</TableCell>
            <TableCell>
              {markup !== null && isAdmin ? `${markup}%` : "-"}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export function PriceListBarTable({ data }: { data: PriceListType | null }) {
  const currency = data?.currency;
  const priceList = data?.priceList || {};

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:px-4 lg:grid-cols-3 print:grid-cols-3">
      {COLUMN_GROUPS.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`min-w-0 ${
            groupIndex !== COLUMN_GROUPS.length - 1
              ? "lg:border-r lg:pr-3 print:border-r"
              : ""
          }`}
        >
          <Table>
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
        </div>
      ))}
    </div>
  );
}

export function PriceListCucinaTable({ data }: { data: PriceListType | null }) {
  const currency = data?.currency;
  const priceList = data?.priceList || {};

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:p-4 lg:grid-cols-3 print:grid-cols-3">
      {COLUMN_GROUPS_CUCINA.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`min-w-0 ${
            groupIndex !== COLUMN_GROUPS.length - 1
              ? "lg:border-r lg:pr-3 print:border-r"
              : ""
          }`}
        >
          <Table>
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
        </div>
      ))}
    </div>
  );
}
