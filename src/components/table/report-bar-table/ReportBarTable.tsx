import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import TobaccoTable from "./TobaccoTable";
import ExpensesTable from "./ExpensesTable";
import ProductTransferTable from "./ProductTransferTable";
import InventoryTable from "./InventoryTable";
import CashVerifyTable from "./CashVerifyTable";

import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";
export default function ReportBarTable({
  data,
}: {
  data: ReportDataByUniqueKey | null;
}) {
  return (
    <>
      {data &&
        data?.data.map((item, index) => {
          const reportData = item.report;
          return (
            <Card
              key={index}
              className="shadow-none border rounded-2xl md:p-4 mb-4 bg-background! m-2"
            >
              <CardHeader>
                <CardTitle className="text-xs text-bl">
                  day: {item.day}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                  <TobaccoTable data={reportData?.tobacco} />
                  <ExpensesTable data={reportData?.expenses} />
                  <ProductTransferTable data={reportData?.productTransfer} />
                  <InventoryTable data={reportData?.inventory} />
                </div>
                <div>
                  <CashVerifyTable data={reportData?.cashVerify} />
                  <div className={classNameHead}>
                    notes:{" "}
                    <span className="text-rd text-xs px-4">
                      {reportData?.notes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </>
  );
}
