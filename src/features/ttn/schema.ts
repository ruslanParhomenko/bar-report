import { z } from "zod";

const numericStringSchema = z
  .string()
  .regex(/^$|^-?\d+(\.\d+)?$/, "число, точка и минус");

export const supplierRowSchema = z.object({
  start: numericStringSchema,
  minus: z.array(numericStringSchema),
  plus: z.array(numericStringSchema),
  final: numericStringSchema,
});

export const suppliersSchema = z.object({
  rowSuppliers: z.record(z.string(), supplierRowSchema),
});

export type SuppliersFormType = z.infer<typeof suppliersSchema>;
