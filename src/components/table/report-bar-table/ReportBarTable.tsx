import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { DeleteListButton } from "../../buttons/DeleteListButton";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";
import { ReportBarData } from "@/constants/type";
import TobaccoTable from "./TobaccoTable";
import ExpensesTable from "./ExpensesTable";
import ProductTransferTable from "./ProductTransferTable";
import InventoryTable from "./InventoryTable";
import NotesTable from "./NotesTable";
import CashVerifyTable from "./CashVerifyTable";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";
export default function ReportBarTable({
  data,
  invalidate,
}: {
  data: ReportBarData;
  invalidate?: () => void;
}) {
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton
            data={data}
            nameTag={REPORT_BAR_ENDPOINT}
            invalidate={invalidate}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1  md:grid-cols-[25%_75%] gap-4">
        <TobaccoTable data={data?.tobacco} />
        <div className="flex flex-col w-full">
          <div className="grid md:grid-cols-3 gap-4">
            <ExpensesTable data={data?.expenses} />
            <ProductTransferTable data={data?.productTransfer} />
            <InventoryTable data={data?.inventory} />
          </div>
          <div className="mt-auto">
            <NotesTable data={data?.notes as string} />
          </div>
          <div className="mt-auto">
            <CashVerifyTable data={data?.cashVerify} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
