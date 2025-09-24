"use client";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useAbility } from "@/providers/AbilityProvider";

export function UserListTable() {
  const t = useTranslations("Home");
  const { query } = useAbility();

  return (
    <>
      {query &&
        query?.map((emp, idx: number) => (
          <div
            key={`${emp.id}-${idx}`}
            className="flex justify-between py-2 w-full"
          >
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
    </>
  );
}
