import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductPreparedType } from "@/features/cucina/schema";
import { classNameHeadCucina, classNameRowBorderCucina } from "./report-cucina";

export default function RemainsTable({
  data,
}: {
  data: ProductPreparedType[];
}) {
  return (
    data && (
      <Table>
        <TableHeader>
          <TableRow className={classNameRowBorderCucina}>
            <TableHead className={classNameHeadCucina}>Remains</TableHead>

            <TableHead>w</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((r, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{r.product}</TableCell>
              <TableCell>{r.weight}</TableCell>
              <TableCell>{r.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
}
