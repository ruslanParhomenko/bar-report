import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/features/settings/create-employee/model/type";
import VacationDataCard from "@/features/settings/view-employee/ui/vacation-data-content";
import { PlaneTakeoff } from "lucide-react";

export default function VacationCard({ employee }: { employee: Employee }) {
  const vacations = employee.vacationPay ?? [];
  return (
    <Card className="flex min-w-0 flex-col overflow-hidden border-0 shadow-none">
      <CardHeader className="py-4">
        <div className="flex min-w-0 items-center justify-center gap-3">
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
            <PlaneTakeoff className="text-primary size-5" />
          </div>

          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight">
              Отпуска
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto md:p-5">
        {vacations.length > 0 &&
          vacations.map((vacation, index) => {
            return (
              <VacationDataCard
                key={`${vacation.startDate}-${vacation.endDate}-${index}`}
                vacation={vacation}
                index={index}
              />
            );
          })}
      </CardContent>
    </Card>
  );
}
