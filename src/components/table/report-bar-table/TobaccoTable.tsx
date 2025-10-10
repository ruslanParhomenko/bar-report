import { Tobacco } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { classNameHead, classNameRowBorder } from "./ReportBarTable";

export default function TobaccoTable({ data }: { data: Tobacco[] }) {
  return data ? (
    <Table>
      <TableHeader>
        <TableRow className={classNameRowBorder}>
          <TableHead className={classNameHead ?? ""}>Tobacco</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((t: Tobacco) => (
          <TableRow key={t.id}>
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
  ) : (
    <div></div>
  );
}
