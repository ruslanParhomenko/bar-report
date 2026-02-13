"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMPLOYEES_ROLE } from "@/features/employees/employee/constants";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { startTransition } from "react";

export default function SelectEmployeeBy({
  role,
  setRole,
  className,
}: {
  role: string;
  setRole: (value: string) => void;
  className?: string;
}) {
  const t = useTranslations("Home");
  return (
    <Select
      value={role}
      onValueChange={(value: string) => {
        startTransition(() => {
          setRole(value);
        });
      }}
    >
      <SelectTrigger
        className={cn(
          "cursor-pointer  h-7! px-2  text-bl md:text-md text-xs [&>svg]:hidden justify-start border-0 shadow-none",
          className,
        )}
      >
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t("all")}</SelectItem>
        {EMPLOYEES_ROLE.map((role, idx) => (
          <SelectItem key={`${role}-${idx}`} value={role}>
            {t(role)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
