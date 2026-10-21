"use client";
import AppTooltip from "@/components/ui/app-tooltip";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";
import { Textarea } from "@/components/ui/textarea";
import { BarForm } from "@/features/bar/model/schema";
import TableExpenses from "@/features/report-bar/ui/expenses-table";
import { TableInventory } from "@/features/report-bar/ui/inventory-table";
import TableProductsTransfer from "@/features/report-bar/ui/transfer-table";
import { GripVertical } from "lucide-react";

import { usePersistentOrder } from "@/hooks/use-persistent-order";
import { useFormContext } from "react-hook-form";
import TableCashVerify from "./cash-table";
import TableTobacco from "./tobacco-table";

const DEFAULT_ORDER = ["tobacco", "inventory", "expenses", "transfer"];

export function ReportBarPage({
  orderProducts,
}: {
  orderProducts: Record<string, string[]> | null;
}) {
  const { register } = useFormContext<BarForm>();
  const [order, setOrder] = usePersistentOrder(
    "report-bar-order",
    DEFAULT_ORDER,
  );

  const blocks: Record<string, React.ReactNode> = {
    tobacco: <TableTobacco />,
    inventory: <TableInventory />,
    expenses: <TableExpenses />,
    transfer: <TableProductsTransfer orderProducts={orderProducts} />,
  };

  return (
    <>
      <Sortable value={order} onValueChange={setOrder} orientation="mixed">
        <SortableContent asChild>
          <div className="my-4 grid grid-cols-1 gap-2 md:grid-cols-4">
            {order.map((id) => (
              <SortableItem key={id} value={id} asChild>
                <div className="relative">
                  <SortableItemHandle className="text-rd absolute top-3 left-1 z-10 cursor-grab">
                    <AppTooltip content="Перетащить">
                      <GripVertical className="size-4" />
                    </AppTooltip>
                  </SortableItemHandle>
                  {blocks[id]}
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContent>
        <SortableOverlay>
          <div className="bg-primary/10 size-full rounded-md" />
        </SortableOverlay>
      </Sortable>

      <TableCashVerify />
      <Textarea
        placeholder="notes ..."
        {...register("report.notes")}
        className="my-4 resize-none"
      />
    </>
  );
}
