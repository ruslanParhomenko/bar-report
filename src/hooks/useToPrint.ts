"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

interface UsePrintOptions {
  title?: string;
  onSuccessMessage?: string;
  onErrorMessage?: string;
}

export const usePrint = ({
  title = "Document",
  onSuccessMessage = "Печать завершена",
  onErrorMessage = "Произошла ошибка при печати",
}: UsePrintOptions = {}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: title,
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

    // pageStyle: `
    //   @page {
    //     size: auto;
    //     margin: 10mm;
    //   }
    //   @media print {
    //     body {
    //       -webkit-print-color-adjust: exact;
    //     }
    //     .no-print {
    //       display: none !important;
    //     }
    //   }
    // `,
    onAfterPrint: () => toast.success(onSuccessMessage),
    onPrintError: () => toast.error(onErrorMessage),
  });

  return { componentRef, handlePrint };
};
