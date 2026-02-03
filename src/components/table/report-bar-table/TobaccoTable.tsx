import { TobaccoSchemaType } from "@/features/report/bar/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { classNameHead, classNameRowBorder } from "./ReportBarTable";

export default function TobaccoTable({
  data,
}: {
  data: TobaccoSchemaType[] | null;
}) {
  if (!data) return <div>not found</div>;
  return (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead className={classNameHead ?? ""}>Tobacco</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((t, idx) => (
          <TableRow key={`${idx}-${t.name}`}>
            <TableCell>{t?.name}</TableCell>
            <TableCell className="text-center">
              {t?.stock.toLocaleString()}
            </TableCell>
            <TableCell className="text-center">
              {t?.incoming?.toLocaleString()}
            </TableCell>
            <TableCell className="text-center">
              {t?.outgoing?.toLocaleString()}
            </TableCell>
            <TableCell className="text-center">
              {t?.finalStock?.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
