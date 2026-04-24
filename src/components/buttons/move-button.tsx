import { ChevronDown, ChevronUp } from "lucide-react";
import { FieldArray, FieldValues, UseFieldArrayMove } from "react-hook-form";

export default function MoveButton<T extends FieldValues>({
  rowIndex,
  fields,
  move,
}: {
  rowIndex: number;
  fields: FieldArray<T>[];
  move: UseFieldArrayMove;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        disabled={rowIndex === 0}
        onClick={() => move(rowIndex, rowIndex - 1)}
        className="cursor-pointer"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={rowIndex === fields.length - 1}
        onClick={() => move(rowIndex, rowIndex + 1)}
        className="cursor-pointer"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
