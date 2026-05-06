import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductPreparedType } from "@/features/cucina/schema";
import { classNameRowBorder } from "../bar/report-bar-archive";

export default function StaffTable({ data }: { data: ProductPreparedType[] }) {
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow className={classNameRowBorder}>
            <TableHead>Staff</TableHead>
            <TableHead>w</TableHead>
            <TableHead>time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="truncate">{item.product}</TableCell>

              <TableCell>{item.weight || "-"}</TableCell>
              <TableCell>{item?.time || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
