import { useIsMobile } from "@/hooks/use-mobile";
import { RefObject, useLayoutEffect } from "react";

export function useMobileTableScroll(
  tableRef: RefObject<HTMLTableElement> | null,
  dependency: string,
) {
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (!isMobile) return;

    requestAnimationFrame(() => {
      const scrollContainer =
        tableRef?.current &&
        tableRef.current?.closest<HTMLElement>('[data-slot="table-container"]');
      if (scrollContainer) {
        scrollContainer.scrollLeft = 140;
      }
    });
  }, [dependency, isMobile]);
}
