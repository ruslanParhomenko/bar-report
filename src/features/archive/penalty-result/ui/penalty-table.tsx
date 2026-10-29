import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ADMIN } from "@/constants/roles";
import { GetRemarksData } from "@/features/penalty/model/type";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { remarksByUniqueEmployee } from "../../penalty-archive/utils";

export default function PenaltyTable({
  data,
  selectedEmployee,
  setSelectedEmployee,
}: {
  data: GetRemarksData[];
  selectedEmployee: string;
  setSelectedEmployee: (employee: string) => void;
}) {
  const session = useSession();
  const isAdmin = session.data?.user?.role === ADMIN;

  const { formattedData, totalBonus, totalPenalty } =
    remarksByUniqueEmployee(data);

  function toggleEmployee(name: string) {
    const employee = name.trim();

    if (selectedEmployee === employee) {
      setSelectedEmployee("");
      return;
    }
    setSelectedEmployee(employee);
  }
  return (
    <Table className="table-fixed">
      <TableBody>
        {formattedData.map((row, index) => (
          <TableRow
            key={`${row.name}-${index}`}
            className={cn(
              "hover:text-rd [&>td]:text-xs",
              selectedEmployee === row.name.trim() && "bg-muted/50",
            )}
          >
            <TableCell className="w-4 px-0 md:w-8 md:px-1">
              {index + 1}
            </TableCell>

            <TableCell
              onClick={() => toggleEmployee(row.name)}
              className={cn(
                "sticky left-0 z-10 w-36 cursor-pointer px-0.5 md:w-60 md:px-1",
                "bg-background md:bg-transparent",
                selectedEmployee === row.name.trim() && "text-rd font-semibold",
              )}
            >
              {row.name}
            </TableCell>

            <TableCell className="w-18 md:w-24">
              {row.dayHours && (
                <span>
                  d:
                  <span className="text-bl mx-4">{row.dayHours}</span>
                </span>
              )}
            </TableCell>

            <TableCell className="w-12 md:w-24">
              {row.nightHours && (
                <span>
                  n:
                  <span className="text-bl mx-4">{row.nightHours}</span>
                </span>
              )}
            </TableCell>

            <TableCell className="text-bl w-12 text-center md:w-24">
              {row.bonus && isAdmin ? `+ ${row.bonus}` : ""}
            </TableCell>

            <TableCell className="text-rd w-12 text-center md:w-24">
              {row.penalty && isAdmin ? `- ${row.penalty}` : ""}
            </TableCell>
          </TableRow>
        ))}

        <TableRow className="font-semibold">
          <TableCell className="text-right" colSpan={4} />
          <TableCell className="text-bl text-center">
            + {isAdmin ? totalBonus : "****"}
          </TableCell>
          <TableCell className="text-rd text-center">
            - {isAdmin ? totalPenalty : "****"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
