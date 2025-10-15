import { Label } from "@/components/ui/label";
import { EmployeesSchemaTypeData } from "../../features/settings/schema";
import { Button } from "../ui/button";
import { Minus } from "lucide-react";

export function EmployeesTable({
  data,
  remove,
}: {
  data: EmployeesSchemaTypeData[];
  remove: (id: string) => void;
}) {
  const handleDeleteUser = (id: string) => {
    remove(id);
  };
  return (
    <>
      {data?.map((emp, idx: number) => (
        <div
          key={`${emp.id}-${idx}`}
          className="flex  md:justify-center justify-between w-full"
        >
          <Label className="md:pr-2 text-bl">{idx}</Label>
          <Label className="min-w-4/10 text-start">{emp.name}</Label>
          <Label className="min-w-4/10 text-start">{emp.role}</Label>
          <Label className="text-bl min-w-1/10">{emp.rate}</Label>
          <Button
            variant={"destructive"}
            className="min-w-0.5/10"
            onClick={() => handleDeleteUser(emp.id as string)}
          >
            <Minus />
          </Button>
        </div>
      ))}
    </>
  );
}
