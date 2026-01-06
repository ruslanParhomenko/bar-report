import { z } from "zod";

const numericStringSchema = z.string().default("");

export const supplierRowSchema = z.object({
  start: numericStringSchema,
  minus: z.array(numericStringSchema).default([]),
  plus: z.array(numericStringSchema).default([]),
});

export const suppliersSchema = z.object({
  unique_key: z.string().default(""),
  year: z.string().default(new Date().getFullYear().toString()),
  month: z.string().default((new Date().getMonth() + 1).toString()),

  rowSuppliers: z.record(z.string(), supplierRowSchema).default({}),
});

export type SupplierRowType = z.infer<typeof supplierRowSchema>;
export type SuppliersFormType = z.infer<typeof suppliersSchema>;
export type SuppliersFormTypeInput = z.input<typeof suppliersSchema>;

export const defaultSuppliersForm = suppliersSchema.parse({});
