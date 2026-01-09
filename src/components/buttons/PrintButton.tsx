"use client";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export default function PrintButton({
  formatPage = "A4 landscape",
  componentRef,
  className,
  disabled = false,
}: {
  formatPage?: string;
  componentRef?: React.RefObject<HTMLDivElement | null> | null;
  className?: string;
  disabled?: boolean;
}) {
  if (!componentRef) return null;
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
  @page {
    size: ${formatPage}; 
    margin: 4mm;
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
