"use client";

import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { AlgorithmData, defaultValues } from "./schema";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PlusIcon, Trash2Icon, CheckIcon, FolderEdit } from "lucide-react";
import { useState } from "react";
import { useAbility } from "@/providers/ability-provider";
import { Textarea } from "@/components/ui/textarea";

export default function AlgorithmForm({
  fieldForm,
  fieldName,
}: {
  fieldForm: UseFieldArrayReturn<AlgorithmData>;
  fieldName: keyof AlgorithmData;
}) {
  const { isAdmin } = useAbility();
  const { fields, append, remove, replace } = fieldForm;

  const { register } = useFormContext();

  const [isEdit, setIsEdit] = useState(false);

  const handleRemove = (idx: number) => {
    if (fields.length === 1) {
      replace([defaultValues]);
      return;
    }
    remove(idx);
  };

  return (
    <div className="overflow-auto">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3}>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEdit((prev) => !prev)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {isEdit ? (
                    <div className="text-rd flex gap-2 justify-center items-center">
                      <CheckIcon className="h-4 w-4" />
                      Save mode
                    </div>
                  ) : (
                    <>
                      <FolderEdit className="h-5 w-5 text-bl" />
                    </>
                  )}
                </button>
              )}
            </TableCell>
          </TableRow>
          {fields.map((item, idx) => {
            const isLast = idx === fields.length - 1;

            return (
              <TableRow key={item.id}>
                <TableCell className="w-6 py-0">{idx + 1}</TableCell>

                <TableCell className="p-0">
                  <Textarea
                    {...register(`${fieldName}.${idx}.value`)}
                    className="border-0 shadow-none  min-h-1 text-xs!"
                    readOnly={!isEdit}
                  />
                </TableCell>

                {isEdit && (
                  <TableCell className="w-16 p-0">
                    <div className="flex gap-3">
                      {isLast && (
                        <button
                          type="button"
                          disabled={!isEdit}
                          onClick={() => append({ ...defaultValues })}
                        >
                          <PlusIcon className="h-4 w-4 text-bl" />
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!isEdit}
                        onClick={() => handleRemove(idx)}
                      >
                        <Trash2Icon className="h-4 w-4 text-rd" />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
