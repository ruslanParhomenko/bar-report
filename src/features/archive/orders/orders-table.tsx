import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrdersData } from "@/features/orders/actions/order-action";

type MonthDay = {
  day: number;
  weekday: string;
};

type OrdersTableProps = {
  orders: GetOrdersData[];
  monthDays: MonthDay[];
};

export default function OrdersTable({ orders, monthDays }: OrdersTableProps) {
  const products = Array.from(
    new Set(
      orders.flatMap((day) =>
        Object.values(day.orders).flatMap((category) => Object.keys(category)),
      ),
    ),
  );

  const getValue = (product: string, day: number) => {
    const dayData = orders.find((item) => Number(item.id) === day);

    if (!dayData) return "";

    for (const category of Object.values(dayData.orders)) {
      if (category[product]) {
        return category[product];
      }
    }

    return "";
  };

  return (
    <Table className="h-[80dvh]">
      <TableHeader>
        <TableRow>
          <TableHead className="bg-background sticky left-0 z-10"></TableHead>

          {monthDays.map(({ day, weekday }) => (
            <TableHead key={day} className="text-bl text-center text-xs">
              <div>{day}</div>
              <div className="text-muted-foreground text-xs">{weekday}</div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product} className="group [&>td]:py-0.5">
            <TableCell className="bg-background group-hover:bg-muted group-hover:text-rd sticky left-0 z-10 text-xs">
              {product}
            </TableCell>

            {monthDays.map(({ day }) => (
              <TableCell
                key={day}
                className="group-hover:bg-muted group-hover:text-rd text-center text-xs"
              >
                {getValue(product, day)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
