import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/providers/EmployeesProvider";
import { MinusCircle, PlusCircle } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function EmployeeVacationCard() {
  const [vacationData, setVacationData] = useState<{
    name: string;
    vacationPay: any[];
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const employees = useEmployees();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("empId");

  useEffect(() => {
    if (!id) return;
    const employee = employees.find((emp) => emp.id === id);

    setVacationData({
      name: employee?.name || "",
      vacationPay: employee?.vacationPay || [],
    });
    setIsOpen(true);
  }, [id]);

  if (!isOpen) return null;
  return (
    <Card className="w-95">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          const params = new URLSearchParams(searchParams.toString());
          params.delete("empId");
          router.replace(`?${params.toString()}`);
        }}
        type="button"
        className={cn(
          "cursor-pointer flex  items-center",
          isOpen ? "justify-start" : "justify-center"
        )}
      >
        {isOpen ? <MinusCircle /> : <PlusCircle />}
      </button>
      <CardHeader>{vacationData?.name}</CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {vacationData?.vacationPay.map((item: any, idx: number) => {
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);

              return (
                <TableRow key={idx}>
                  <TableCell>{startDate && startDate.toDateString()}</TableCell>
                  <TableCell> - </TableCell>
                  <TableCell>{endDate && endDate.toDateString()}</TableCell>
                  <TableCell> = </TableCell>
                  <TableCell className="text-end"> {item.countDays}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={5} className="text-end">
                {vacationData?.vacationPay.reduce(
                  (acc: number, item: any) => acc + Number(item.countDays || 0),
                  0
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
