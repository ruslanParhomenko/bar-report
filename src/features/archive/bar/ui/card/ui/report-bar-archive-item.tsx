"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CashVerifyTable from "@/features/archive/bar/ui/card/ui/cash-table";
import ExpensesTable from "@/features/archive/bar/ui/card/ui/expenses-table";
import InventoryTable from "@/features/archive/bar/ui/card/ui/inventory-table";
import TobaccoTable from "@/features/archive/bar/ui/card/ui/tobacco-table";
import ProductTransferTable from "@/features/archive/bar/ui/card/ui/transfer-table";
import type { GetReportData } from "@/features/report-bar/model/type";

export const classNameHead = "text-shadow-muted-foreground font-bold";

export default function ReportBarArchiveItem({
  item,
  defaultOpen,
}: {
  item: GetReportData;
  defaultOpen?: boolean;
}) {
  const reportData = item.report;

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card className="bg-background! my-2 shadow-none md:m-2">
        <CollapsibleTrigger asChild>
          <CardTitle className="text-bl cursor-pointer p-4 text-xs">
            day: {item.id}
          </CardTitle>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="flex flex-col gap-4 pb-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <TobaccoTable data={reportData?.tobacco} />
              <ExpensesTable data={reportData?.expenses} />
              <ProductTransferTable data={reportData?.productTransfer} />
              <InventoryTable data={reportData?.inventory} />
            </div>

            <div>
              <CashVerifyTable data={reportData?.cashVerify} />
              <div className={classNameHead}>
                notes:{" "}
                <span className="text-rd px-4 text-xs">
                  {reportData?.notes}
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
