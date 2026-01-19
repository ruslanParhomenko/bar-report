import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { DeleteListButton } from "../../../features/archive/DeleteListButton";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";
import TobaccoTable from "./TobaccoTable";
import ExpensesTable from "./ExpensesTable";
import ProductTransferTable from "./ProductTransferTable";
import InventoryTable from "./InventoryTable";
import CashVerifyTable from "./CashVerifyTable";
import { ReportBarType } from "@/app/actions/archive/reportBarAction";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";
export default function ReportBarTable({ data }: { data: ReportBarType }) {
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton data={data} nameTag={REPORT_BAR_ENDPOINT} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <TobaccoTable data={data?.tobacco} />
          <ExpensesTable data={data?.expenses} />
          <ProductTransferTable data={data?.productTransfer} />
          <InventoryTable data={data?.inventory} />
        </div>
        <div>
          <CashVerifyTable data={data?.cashVerify} />
          <div className={classNameHead}>
            notes: <span className="text-rd text-xs px-4">{data?.notes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
