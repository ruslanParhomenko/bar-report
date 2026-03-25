import { z } from "zod";

const dayValueSchema = z.string();

export const rowCashSchema = z.array(dayValueSchema);
export const cashFormSchema = z.object({
  rowCashData: z.record(z.string(), rowCashSchema),
  start_241: z.string(),
  ao_532: z.string(),
  z_531: z.string(),
  final_241: z.string().optional(),
});

export type CashForm = z.infer<typeof cashFormSchema>;
export const defaultCashForm: CashForm = {
  rowCashData: {},
  start_241: "",
  ao_532: "",
  z_531: "",
};
