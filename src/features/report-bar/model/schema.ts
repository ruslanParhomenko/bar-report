import { z } from "zod";

// products transfer
export const productTransferSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  destination: z.string(),
  time: z.string(),
});

export type ProductTransferSchemaType = z.infer<typeof productTransferSchema>;

export const productTransferDefault = Array.from({ length: 7 }, () => ({
  name: "",
  quantity: "",
  destination: "",
  time: "",
}));

// inventory
export const inventorySchema = z.object({
  name: z.string(),
  quantity: z.string().regex(/^\d+(\.\d+)?$/),
  time: z.string(),
});

export type InventorySchemaType = z.infer<typeof inventorySchema>;

// expenses
export const expenseSchema = z.object({
  name: z.string(),
  sum: z.string(),
  time: z.string(),
});

export type ExpensesSchemaType = z.infer<typeof expenseSchema>;

export const expensesDefault = Array.from({ length: 7 }, () => ({
  name: "",
  sum: "",
  time: "",
}));

// tobacco
export const tobaccoSchema = z.object({
  name: z.string(),
  stock: z.number(),
  incoming: z.string(),
  outgoing: z.string(),
  finalStock: z.number(),
});

export type TobaccoSchemaType = z.infer<typeof tobaccoSchema>;

export const cashVerifySchema = z.object({
  hours: z.string(),
  value: z.string(),
});

export type CashVerifySchemaType = z.infer<typeof cashVerifySchema>;
export const cashVerifyDefault = Array.from({ length: 13 }, () => ({
  hours: "",
  value: "",
}));

// report bar
export const reportBarSchema = z.object({
  expenses: z.array(expenseSchema),
  tobacco: z.array(tobaccoSchema).optional(),
  cashVerify: z.array(cashVerifySchema),
  cashVerifyBuffet: z.array(cashVerifySchema).optional(),
  productTransfer: z.array(productTransferSchema),
  inventory: z.array(inventorySchema),
  notes: z.string(),
});

export type ReportBarForm = z.infer<typeof reportBarSchema>;

export const reportBarDefault = {
  expenses: expensesDefault,
  tobacco: [],
  cashVerify: cashVerifyDefault,
  cashVerifyBuffet: cashVerifyDefault,
  productTransfer: productTransferDefault,
  inventory: [],
  notes: "",
};
