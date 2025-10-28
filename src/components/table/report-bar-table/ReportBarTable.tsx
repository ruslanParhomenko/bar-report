import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { DeleteListButton } from "../../../features/archive/DeleteListButton";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";
import { ReportBarData } from "@/constants/type";
import TobaccoTable from "./TobaccoTable";
import ExpensesTable from "./ExpensesTable";
import ProductTransferTable from "./ProductTransferTable";
import InventoryTable from "./InventoryTable";
import CashVerifyTable from "./CashVerifyTable";
import NotesTable from "../NotesTable";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";
export default function ReportBarTable({ data }: { data: ReportBarData }) {
  const visibleTables = [
    data.tobacco,
    data.expenses,
    data.productTransfer,
    data.inventory,
    data.notes,
    data.cashVerify,
  ].filter(Boolean).length;
  const gridCols =
    visibleTables === 1 ? "md:grid-cols-1" : "md:grid-cols-[25%_75%]";
  const gridColsFooter =
    visibleTables === 1 ? "md:grid-cols-1" : "md:grid-cols-3";
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton data={data} nameTag={REPORT_BAR_ENDPOINT} />
        </CardTitle>
      </CardHeader>
      <CardContent className={`grid grid-cols-1  ${gridCols} gap-4`}>
        <TobaccoTable data={data?.tobacco} />
        <div className="flex flex-col w-full">
          <div className={`grid ${gridColsFooter} gap-4`}>
            <ExpensesTable data={data?.expenses} />
            <ProductTransferTable data={data?.productTransfer} />
            <InventoryTable data={data?.inventory} />
          </div>
          <div className="mt-auto"></div>
          <div className="mt-auto">
            <CashVerifyTable data={data?.cashVerify} />
          </div>
        </div>
      </CardContent>
      <NotesTable data={data?.notes as string} />
    </Card>
  );
}
