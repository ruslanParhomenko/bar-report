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
  Tobacco,
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
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <TobaccoTable data={data?.tobacco as Tobacco[]} />
          <ExpensesTable data={data?.expenses as Expense[]} />
          <ProductTransferTable
            data={data?.productTransfer as ProductTransfer[]}
          />
          <InventoryTable data={data?.inventory as Inventory[]} />
        </div>
        <div>
          <CashVerifyTable data={data?.cashVerify as CashVerify[]} />
          <NotesTable data={data?.notes as string} />
        </div>
      </CardContent>
    </Card>
  );
}
