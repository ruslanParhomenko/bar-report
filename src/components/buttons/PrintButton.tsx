"use client";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export default function PrintButton({
  componentRef,
  className,
  disabled = false,
}: {
  componentRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  disabled?: boolean;
}) {
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
  @page {
    size: A4 landscape; 
    margin: 2mm;
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
    }

    .no-print {
      display: none !important;
    }
    .print-area {
      page-break-inside: avoid !important;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .print-card {
      page-break-inside: avoid !important;
      flex: 1 1 22%; 
      min-width: 22%;
    }
  }
`,
    onAfterPrint: () => toast.success("Печать завершена"),
    onPrintError: () => toast.error("Произошла ошибка при печати"),
  });

  return (
    <button
      onClick={() => {
        if (!componentRef) return;
        handlePrint();
      }}
      type="button"
      disabled={disabled}
      className={cn(
        "print:hidden  cursor-pointer ",
        className,
        disabled && "opacity-50"
      )}
    >
      <Printer className="h-5 w-5 hover:text-bl" strokeWidth={1.5} />
    </button>
  );
}
