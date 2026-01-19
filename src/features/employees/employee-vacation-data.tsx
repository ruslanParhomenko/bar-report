"use client";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/providers/EmployeesProvider";
import { MinusCircle } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function EmployeeVacationData() {
  const [vacationData, setVacationData] = useState<{
    name: string;
    vacationPay: any[];
  } | null>(null);
  const employees = useEmployees();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("vacationId");

  useEffect(() => {
    if (!id) return;
    const employee = employees.find((emp) => emp.id === id);

    setVacationData({
      name: employee?.name || "",
      vacationPay: employee?.vacationPay || [],
    });
  }, [id]);

  if (!id) return null;
  return (
    <div className="md:min-w-100 md:py-5">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("vacationId");

          router.replace(`?${params.toString()}`);
        }}
        type="button"
        className={cn("cursor-pointer flex items-center")}
      >
        <MinusCircle className="w-4 h-4" />
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
                  0,
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
