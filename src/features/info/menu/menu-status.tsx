"use client";
import PrintButton from "@/components/buttons/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns, LABELS } from "./constants";
import { useRef } from "react";
import { Menu } from "@/app/actions/google/google-action";

export default function StatusMenu({ data }: { data: Menu | null }) {
  const selectData = data && data.statusMenu;
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PrintButton componentRef={componentRef} className="mb-2" />
      <div
        ref={componentRef}
        className="flex flex-col md:flex-row gap-2 print:grid print:grid-cols-4"
      >
        {columns.map((col) => (
          <Card
            key={col.key}
            className="rounded-2xl shadow-sm md:flex-1 md:min-w-[23%] bg-transparent"
          >
            <CardHeader>
              <CardTitle className="text-center font-bold text-md">
                {col.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {selectData?.[col.key].map((item, idx) => (
                  <li
                    key={idx}
                    className={
                      LABELS.includes(item)
                        ? "font-bold text-bl text-center pb-1"
                        : "truncate"
                    }
                  >
                    {item === "-" ? <span> .</span> : item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
