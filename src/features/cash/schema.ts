import { z } from "zod";

const dayValueSchema = z.string().default("");

export const rowCashSchema = z.array(dayValueSchema).default([]);
export const cashSchema = z.object({
  rowCashData: z.record(z.string(), rowCashSchema).default({}),
  start_241: z.string().default(""),
  ao_532: z.string().default(""),
  z_531: z.string().default(""),
  final_241: z.string().default(""),
});

export type CashFormTypeInput = z.input<typeof cashSchema>;
export const defaultCashForm = cashSchema.parse({});
