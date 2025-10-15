import { Label } from "@/components/ui/label";
import { EmployeesSchemaTypeData } from "../../features/settings/schema";
import { Button } from "../ui/button";
import { Minus } from "lucide-react";
import { format } from "date-fns";

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
      {data?.map((emp, idx: number) => {
        return (
          <div
            key={`${emp.id}-${idx}`}
            className="flex   justify-between w-full"
          >
            <Label className=" text-start">
              {format(emp.employmentDate, "dd.MM.yy")}
            </Label>
            <Label className=" text-start">{emp.name}</Label>
            <Label className="text-start">{emp.role}</Label>
            <Label className="text-bl ">{Number(emp.rate) / 100}</Label>
            <Button
              variant={"destructive"}
              className=""
              onClick={() => handleDeleteUser(emp.id as string)}
            >
              <Minus />
            </Button>
          </div>
        );
      })}
    </>
  );
}
