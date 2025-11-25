import { Row } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import { DeleteListButton } from "../archive/DeleteListButton";
import { BREAK_LIST_ENDPOINT } from "@/constants/endpoint-tag";
import { BreakListData } from "@/constants/type";
import { Separator } from "@/components/ui/separator";

export function BreakArchiveByDay({ data }: { data: BreakListData }) {
  const filtered = data?.rows?.filter((row: Row) => row.name?.trim());

  if (!filtered?.length) return null;
  return (
    <>
      <DeleteListButton data={data} nameTag={BREAK_LIST_ENDPOINT} />
      <Separator className="my-1 bg-bl" />
      <Table>
        <TableBody>
          {filtered.map((row: Row) => {
            const hoursEntries = Object.entries(row)
              .filter(([key]) => key.startsWith("h_"))
              .map(([key, value]) => ({
                hour: key.substring(2),
                value: value as string,
              }))
              .filter(({ value }) => value && value !== "X");

            return (
              <TableRow key={row.id} className="hover:text-rd  cursor-pointer">
                <TableCell className="font-bold md:w-3xs sticky left-0 bg-card">
                  {row.name ?? "-"}
                </TableCell>
                <TableCell className="text-sm text-gr  md:w-xs">
                  {row.externalId}
                </TableCell>
                <TableCell className="text-center">
                  {hoursEntries.length}
                </TableCell>
                <TableCell className="text-center">...</TableCell>

                {hoursEntries.map(({ hour, value }) => (
                  <TableCell key={`${row.id}-${hour}`} className="text-center">
                    {hour}:{value}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
