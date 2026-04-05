import { z } from "zod";

export const amountSchema = z.object({
  value: z.string(),
  time: z.string(),
  typeAmount: z.enum(["mdl", "chips"]),
});

export type Amount = z.infer<typeof amountSchema>;

export const createDefaultAmount = (): Amount => ({
  value: "",
  time: "",
  typeAmount: "mdl",
});

export const tipsAddSchema = z.object({
  idEmployee: z.string(),
  employeeName: z.string(),
  amount: z.array(amountSchema),
  shift: z.enum(["8-20", "9-21", "12-00", "18-06", "20-08"]),
});

export type TipsAddFormValues = z.infer<typeof tipsAddSchema>;

export const createDefaultTipsAdd = (): TipsAddFormValues => ({
  idEmployee: "",
  employeeName: "",
  amount: [createDefaultAmount()],
  shift: "8-20",
});
