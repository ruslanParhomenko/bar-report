"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { AlgorithmData, defaultValues } from "./schema";

export default function AlgorithmForm({
  fieldForm,
  fieldName,
  isEdit,
}: {
  fieldForm: UseFieldArrayReturn<AlgorithmData>;
  fieldName: keyof AlgorithmData;
  isEdit: boolean;
}) {
  const { fields, append, remove, replace } = fieldForm;
  const { register } = useFormContext();
  const { theme } = useTheme();

  const handleRemove = (idx: number) => {
    fields.length === 1 ? replace([defaultValues]) : remove(idx);
  };

  return (
    <Table className="mt-4">
      <TableBody>
        {fields.map((item, idx) => {
          const isLast = idx === fields.length - 1;

          return (
            <TableRow key={item.id}>
              <TableCell className="w-6 py-0">{idx + 1}</TableCell>

              <TableCell className="p-0">
                <TextareaAutosize
                  {...register(`${fieldName}.${idx}.value` as const)}
                  readOnly={!isEdit}
                  className={cn(
                    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "bg-background! min-h-1 resize-none border-0 text-xs! shadow-none",
                    theme === "dark" ? "border-0" : "",
                  )}
                />
              </TableCell>

              {isEdit && (
                <TableCell className="w-16 p-0">
                  <div className="flex gap-3">
                    {isLast && (
                      <button
                        type="button"
                        onClick={() => append({ ...defaultValues })}
                      >
                        <PlusIcon className="text-bl h-4 w-4" />
                      </button>
                    )}
                    <button type="button" onClick={() => handleRemove(idx)}>
                      <Trash2Icon className="text-rd h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
