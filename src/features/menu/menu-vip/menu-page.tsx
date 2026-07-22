"use client";
import { OrnamentBorder } from "@/components/wrapper/ornament-border";
import { PrinterIcon } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ColCover } from "./col-cover";
import { ColSingle } from "./col-single";
import { LocalTranslateFn, PageStructure } from "./types";

export function SinglePage({
  page,
  label,
  t,
  isRtl,
}: {
  page: PageStructure;
  label: string;
  t: LocalTranslateFn;
  isRtl: boolean;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Menu — ${label}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      @media print {
        html, body { font-family: "Playfair Display", Georgia, serif !important }
        .print-root {
          width: 210mm !important;
          height: 288mm !important;
          padding: 4mm !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .no-print { display: none !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        img, svg { break-inside: avoid; }
      }
    `,
  });

  return (
    <div className="flex flex-col md:h-full">
      <div
        ref={printRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="print-root flex min-h-0 flex-1 flex-col pb-2 md:px-2"
      >
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
          {page.columns.map((col, i) => {
            if (col.type === "cover") {
              return (
                <OrnamentBorder key={`${col.id}-${i}`}>
                  <ColCover col={col} t={t} />
                </OrnamentBorder>
              );
            }

            return (
              <OrnamentBorder key={`${col.id}-${i}`}>
                <ColSingle col={col} t={t} />
              </OrnamentBorder>
            );
          })}
        </div>
      </div>
      <div className="no-print flex shrink-0 px-2">
        <button onClick={() => handlePrint()} className="cursor-pointer">
          <PrinterIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
