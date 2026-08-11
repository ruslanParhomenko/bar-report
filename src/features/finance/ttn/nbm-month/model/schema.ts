import { z } from "zod";

const numericStringSchema = z
  .string()
  .regex(/^$|^-?\d+(\.\d+)?$/, "число, точка и минус");

export const supplierRowSchemaNBM = z.object({
  minus: z.array(numericStringSchema),
});

export const suppliersSchemaNBM = z.object({
  rowSuppliers: z.record(z.string(), supplierRowSchemaNBM),
});

export type TTNFormNBM = z.infer<typeof suppliersSchemaNBM>;
