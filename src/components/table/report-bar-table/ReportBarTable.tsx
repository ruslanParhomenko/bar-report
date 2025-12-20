import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { DeleteListButton } from "../../../features/archive/DeleteListButton";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";
import TobaccoTable from "./TobaccoTable";
import ExpensesTable from "./ExpensesTable";
import ProductTransferTable from "./ProductTransferTable";
import InventoryTable from "./InventoryTable";
import CashVerifyTable from "./CashVerifyTable";
import NotesTable from "../NotesTable";
import { ReportDataById } from "@/app/actions/archive/reportBarAction";
import {
  CashVerify,
  Expense,
  Inventory,
  ProductTransfer,
} from "@/generated/prisma";

export const classNameHead = "text-shadow-muted-foreground font-bold";
export const classNameRowBorder = "border-b-bl";
export default function ReportBarTable({ data }: { data: ReportDataById }) {
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton data={data} nameTag={REPORT_BAR_ENDPOINT} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1  xl:grid-cols-[25%_75%] gap-4">
        <TobaccoTable data={data?.tobacco as any[]} />
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ExpensesTable data={data?.expenses as Expense[]} />
            <ProductTransferTable
              data={data?.productTransfer as ProductTransfer[]}
            />
            <InventoryTable data={data?.inventory as Inventory[]} />
          </div>
          <div className="mt-auto"></div>
          <div className="mt-auto">
            <CashVerifyTable data={data?.cashVerify as CashVerify[]} />
          </div>
        </div>
      </CardContent>
      <NotesTable data={data?.notes as string} />
    </Card>
  );
}
