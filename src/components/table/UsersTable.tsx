import { Label } from "@/components/ui/label";
import { UsersSchemaTypeData } from "../../features/settings/schema";
import { Button } from "../ui/button";
import { Minus } from "lucide-react";

export function UsersTable({
  data,
  remove,
}: {
  data: UsersSchemaTypeData[];
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
          className="flex items-center justify-between w-full"
        >
          <Label className="min-w-1/9">{idx}</Label>
          <Label className="min-w-5/9">{emp.mail}</Label>
          <Label className="text-muted-foreground min-w-2/9">{emp.role}</Label>
          <Button
            variant={"destructive"}
            className="min-w-0.5/9"
            onClick={() => handleDeleteUser(emp.id as string)}
          >
            <Minus />
          </Button>
        </div>
      ))}
    </>
  );
}
