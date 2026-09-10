"use client";
import { BarForm } from "@/features/bar/model/schema";
import { useEffect, useState } from "react";
export function LatestAmount({
  tipsValues,
}: {
  tipsValues: BarForm["tipsAdd"];
}) {
  const [isNew, setIsNew] = useState(false);
  const allAmounts = tipsValues
    .flatMap((emp) =>
      (emp.amount || []).map((a) => ({
        employeeName: emp.employeeName,
        shift: emp.shift,
        value: a.value,
        typeAmount: a.typeAmount,
        time: a.time,
        createdAt: Number(a.uniqueId),
      })),
    )
    .filter((item) => item.createdAt != null)
    .sort((a, b) => b.createdAt - a.createdAt);
  const latestAmount = allAmounts.at(0);
  useEffect(() => {
    if (!latestAmount) return;
    setIsNew(true);
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [latestAmount?.createdAt]);
  if (!latestAmount) return null;
  const [firstName, lastName] = latestAmount.employeeName.split(" ");
  return (
    <div
      className={`[&>span]:text-muted-foreground grid w-full grid-cols-4 p-2 text-xs [&>span]:text-center ${isNew ? "bg-bl [&>span]:text-white" : ""}`}
    >
      {" "}
      <span>
        {" "}
        {lastName} {firstName?.slice(0, 1)}{" "}
      </span>{" "}
      <span>{latestAmount.time}</span>{" "}
      <span>{latestAmount.typeAmount.slice(0, 1)}</span>{" "}
      <span>{latestAmount.value}</span>{" "}
    </div>
  );
}
