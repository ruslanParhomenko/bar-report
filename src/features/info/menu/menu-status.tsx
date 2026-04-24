"use client";
import { Menu } from "@/app/actions/google/google-action";
import PrintButton from "@/components/buttons/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";
import { columns, LABELS } from "./constants";

export default function StatusMenu({ data }: { data: Menu | null }) {
  const selectData = data && data.statusMenu;
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PrintButton componentRef={componentRef} className="mb-2" />
      <div
        ref={componentRef}
        className="flex flex-col gap-2 md:flex-row print:grid print:grid-cols-4"
      >
        {columns.map((col) => (
          <Card
            key={col.key}
            className="rounded-2xl bg-transparent shadow-sm md:min-w-[23%] md:flex-1"
          >
            <CardHeader>
              <CardTitle className="text-md text-center font-bold">
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
                        ? "text-bl pb-1 text-center font-bold"
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
