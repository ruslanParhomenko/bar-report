"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
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
                <Textarea
                  {...register(`${fieldName}.${idx}.value` as const)}
                  className="bg-background! min-h-1 border-0 text-xs! shadow-none"
                  readOnly={!isEdit}
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
