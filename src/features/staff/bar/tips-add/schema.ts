import { z } from "zod";

export const amountSchema = z.object({
  value: z.string(),
  time: z.string(),
  typeAmount: z.enum(["mdl", "chips"]),
  uniqueId: z.string(),
});
const resultAmountSchema = z.object({
  value: z.number(),
  uniqueId: z.string(),
});

export type Amount = z.infer<typeof amountSchema>;

export const createDefaultAmount = (): Amount => ({
  value: "",
  time: "",
  typeAmount: "mdl",
  uniqueId: "",
});

export const tipsAddSchema = z.object({
  amount: z.array(amountSchema),
  createdAt: z.number(),
  employeeName: z.string(),
  endDate: z.number(),
  idEmployee: z.string(),
  isClosed: z.boolean(),
  isWaiters: z.boolean(),
  resultAmount: z.array(resultAmountSchema),
  role: z.enum(["waiters", "barmen"]),
  shift: z.enum(["8-20", "9-21", "12-00", "18-06", "20-08"]),
  over: z.number().optional(),

  draftValue: z.string(),
  typeAmount: z.enum(["mdl", "chips", ""]),
});

export type TipsAddForm = z.infer<typeof tipsAddSchema>;

export const createDefaultTipsAdd = (): TipsAddForm => ({
  amount: [createDefaultAmount()],
  createdAt: 0,
  endDate: 0,
  idEmployee: "",
  isClosed: false,
  isWaiters: false,
  resultAmount: [],
  employeeName: "",
  shift: "8-20",
  role: "waiters",
  over: 0,

  draftValue: "",
  typeAmount: "",
});
