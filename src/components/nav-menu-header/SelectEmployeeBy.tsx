"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { startTransition } from "react";

export const EMPLOYEES_ROLE = [
  "waiters",
  "barmen",
  "cook",
  "mngr",
  "dish",
  "buyer",
];

export default function SelectEmployeeBy({
  role,
  setRole,
}: {
  role: string;
  setRole: (value: string) => void;
}) {
  const t = useTranslations("Home");
  return (
    <div className="flex items-center">
      <Select
        value={role}
        onValueChange={(value: string) => {
          startTransition(() => {
            setRole(value);
          });
        }}
      >
        <SelectTrigger className="w-24 h-7! p-1 rounded-full text-bl md:text-md text-xs [&>svg]:hidden justify-center">
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
    </div>
  );
}
