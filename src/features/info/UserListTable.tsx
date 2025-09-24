"use client";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useAbility } from "@/providers/AbilityProvider";

export function UserListTable() {
  const t = useTranslations("Home");
  const { query } = useAbility();

  return (
    <div className="w-full p-1 py-4">
      {query &&
        query?.map((emp, idx: number) => (
          <div key={`${emp.id}-${idx}`} className="flex justify-between py-2">
            <Label className="min-w-1/9">{emp.id}</Label>
            <Label className="min-w-5/9">{emp.mail}</Label>
            <Label className="text-muted-foreground min-w-2/9">
              {emp.role}
            </Label>
            <Label className="min-w-1/9">
              {emp.isActive ? "activ" : "non-activ"}
            </Label>
          </div>
        ))}
    </div>
  );
}
