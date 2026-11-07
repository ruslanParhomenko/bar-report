"use client";

import { OrnamentBorder } from "@/components/wrapper/ornament-border";
import InfoSection from "@/features/menu/info-buffet/ui/info-section";
import { SECTIONS } from "@/features/menu/menu-daily/model/constants";
import { MenuDailyForm } from "@/features/menu/menu-daily/model/schema";
import { PrinterIcon } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function InfoBuffetPage({
  menuDaily,
  qrUrl,
}: {
  menuDaily: MenuDailyForm | null;
  qrUrl?: string;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Menu — Buffet",
    pageStyle: `
  @page { size: A4 portrait; margin: 0; }
  @media print {
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      font-family: "Cormorant Garamond", Georgia, serif !important;
    }
    .print-root {
      width: 210mm !important;
      height: 288mm !important;
      margin: 0 !important;
      padding: 4mm !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
`,
  });

  const getItems = (cat: (typeof SECTIONS)[number]) => menuDaily?.[cat] ?? [];

  return (
    <div
      className="flex flex-col md:h-full"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <div ref={printRef} className="print-root flex min-h-0 flex-1 flex-col">
        <div className="grid h-full w-full grid-cols-1">
          <div className="w-full">
            <OrnamentBorder className="md:h-14! md:w-14!">
              {SECTIONS.map((cat) => (
                <div key={cat}>
                  <InfoSection
                    category={cat}
                    items={getItems(cat)}
                    qrUrl={qrUrl}
                  />
                </div>
              ))}
            </OrnamentBorder>
          </div>
        </div>
      </div>
      <div className="no-print text-rd z-100 my-2 flex w-full shrink-0 items-center justify-end p-2">
        <button onClick={() => handlePrint()} className="cursor-pointer">
          <PrinterIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
