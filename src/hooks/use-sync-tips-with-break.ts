import {
  createDefaultTipsAdd,
  TipsAddFormValues,
} from "@/features/bar/tips-add/schema";
import { useEffect } from "react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

type Employee = {
  id: string;
  name: string;
  idShift?: string;
};

type Props = {
  form: UseFormReturn<any>;
  tipsArray: UseFieldArrayReturn<any, "tipsAdd", "fieldId">;
  tipsValues: TipsAddFormValues[];
  employees: Employee[];
};

export function useSyncTipsWithBreak({
  form,
  tipsArray,
  tipsValues,
  employees,
}: Props) {
  useEffect(() => {
    if (!employees) return;

    const current = tipsValues ?? [];
    const nextIds = new Set(employees.map((e) => e.id));

    // 🧹 REMOVE
    const indexesToRemove: number[] = [];

    current.forEach((item, index) => {
      if (!nextIds.has(item.idEmployee)) {
        indexesToRemove.push(index);
      }
    });

    if (indexesToRemove.length) {
      indexesToRemove
        .sort((a, b) => b - a)
        .forEach((index) => tipsArray.remove(index));
    }

    // 🔁 ВАЖНО: берем актуальное состояние через form
    const fresh: TipsAddFormValues[] = form.getValues("tipsAdd") ?? [];

    const freshMap = new Map(
      fresh.map((item, index) => [item.idEmployee, { item, index }]),
    );

    // ➕ ADD
    employees.forEach((emp) => {
      if (!freshMap.has(emp.id)) {
        tipsArray.append({
          ...createDefaultTipsAdd(),
          idEmployee: emp.id,
          employeeName: emp.name,
          shift: emp.idShift ?? "8-20",
          amount: [],
        });
      }
    });

    // 🔄 UPDATE
    employees.forEach((emp) => {
      const existing = freshMap.get(emp.id);
      if (!existing) return;

      const currentItem = existing.item;

      if (currentItem.shift !== emp.idShift) {
        tipsArray.update(existing.index, {
          ...currentItem, // ✅ сохраняем amount
          shift: emp.idShift ?? currentItem.shift,
        });
      }
    });
  }, [employees, tipsValues]);
}
