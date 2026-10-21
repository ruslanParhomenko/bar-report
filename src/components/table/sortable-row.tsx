"use client";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

export function SortableRow({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: (handle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none px-1 active:cursor-grabbing"
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        className,
        isDragging && "bg-muted relative z-10 opacity-80",
      )}
    >
      {children(handle)}
    </TableRow>
  );
}
