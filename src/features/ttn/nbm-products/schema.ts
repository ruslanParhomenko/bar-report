import { z } from "zod";

const numericStringSchema = z
  .string()
  .regex(/^$|^-?\d+(\.\d+)?$/, "число, точка и минус");

export const productsSchemaNBM = z.object({
  rowProducts: z.record(z.string(), z.array(numericStringSchema)),
});

export type ProductsFormNBM = z.infer<typeof productsSchemaNBM>;
