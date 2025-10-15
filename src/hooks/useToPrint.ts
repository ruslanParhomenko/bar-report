import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-hot-toast";

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
        size: auto;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    onAfterPrint: () => toast.success(onSuccessMessage),
    onPrintError: () => toast.error(onErrorMessage),
  });

  return { componentRef, handlePrint };
};
