import * as yup from "yup";
import { INVENTORY_DATA } from "./constants";
//products transfer
export const productTransferSchema = yup
  .array(
    yup.object().shape({
      name: yup.string().default(""),
      quantity: yup.string().default(""),
      destination: yup.string().default(""),
      time: yup.string().default(""),
    })
  )
  .default([{ name: "", quantity: "", destination: "", time: "" }]);

export type ProductTransferSchemaType = yup.InferType<
  typeof productTransferSchema
>;
export const productTransferDefault = Array.from({ length: 8 }, () => ({
  name: "",
  quantity: "",
  destination: "",
  time: "",
}));

// inventory
export const inventorySchema = yup
  .array(
    yup.object().shape({
      name: yup.string().default(""),
      quantity: yup.string().default(""),
      time: yup.string().default(""),
    })
  )
  .default([{ name: "", quantity: "", time: "" }]);
export type InventorySchemaType = yup.InferType<typeof inventorySchema>;
export const inventoryDefault = INVENTORY_DATA.map((item) => ({
  name: item,
  quantity: "",
  time: "",
}));

//expenses
export const expenseSchema = yup
  .array(
    yup.object().shape({
      name: yup.string().default(""),
      sum: yup.string().default(""),
      time: yup.string().default(""),
    })
  )
  .default([{ name: "", sum: "", time: "" }]);

export type ExpensesSchemaType = yup.InferType<typeof expenseSchema>;
export const expensesDefault = new Array(8).fill({
  name: "",
  sum: "",
  time: "",
});

//tobacco
export const LIST_TOBACCO = [
  "Marlboro",
  "Parliament",
  "Cohiba Siglo I",
  "Guantonomera",
  "Monte Cristo",
  "R&J N3",
  "Гильотина (2)",
  "Зажигалка",
];
export const tobaccoSchema = yup
  .array(
    yup.object().shape({
      name: yup
        .string()
        .oneOf(LIST_TOBACCO, "Name must be one of the predefined list"),
      stock: yup.string(),
      incoming: yup.string(),
      outgoing: yup.string(),
      finalStock: yup.string(),
    })
  )
  .default([
    { name: "", stock: "0", incoming: "", outgoing: "", finalStock: "0" },
  ]);
export type TobaccoSchemaType = yup.InferType<typeof tobaccoSchema>;
export const tobaccoDefault = LIST_TOBACCO.map((name) => ({
  name,
  stock: "0",
  incoming: "",
  outgoing: "",
  finalStock: "0",
}));

// cash verify

export const HOURS = Array.from({ length: 24 }).map((_, idx) => {
  const hour = (8 + idx) % 24;
  return hour.toString().padStart(2, "0") + ":00";
});
export const cashVerifySchema = yup
  .array(
    yup.object().shape({
      hours: yup.string(),
      value: yup.string(),
    })
  )
  .default(HOURS.map((hour) => ({ hours: hour, value: "" })));

export type CashVerifySchemaType = yup.InferType<typeof cashVerifySchema>;
export const cashVerifyDefault = HOURS.map((hour) => ({
  hours: hour,
  value: "",
}));

//report bar
export const reportBarSchema = yup.object().shape({
  date: yup.date().default(new Date()),
  expenses: expenseSchema,
  tobacco: tobaccoSchema,
  cashVerify: cashVerifySchema,
  productTransfer: productTransferSchema,
  inventory: inventorySchema,
  notes: yup.string().nullable().default(""),
});

export type ReportBarFormValues = yup.InferType<typeof reportBarSchema>;
export const defaultValuesReportBar = {
  date: new Date(),
  expenses: expensesDefault,
  tobacco: tobaccoDefault,
  cashVerify: cashVerifyDefault,
  productTransfer: productTransferDefault,
  inventory: inventoryDefault,
  notes: "",
};
