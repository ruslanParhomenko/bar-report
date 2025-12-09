import * as yup from "yup";

export const stopListItemSchema = yup.object({
  key: yup.number(),
  product: yup.string().default(""),
  date: yup.string().default(""),
});
export type StopListItemSchemaType = yup.InferType<typeof stopListItemSchema>;
export const defaultStopList = stopListItemSchema.getDefault();

export const stopListSchema = yup.object({
  stopList: yup.array().of(stopListItemSchema).default([defaultStopList]),
});

export type StopListSchemaType = yup.InferType<typeof stopListSchema>;
export const defaultStopListSchema = stopListSchema.getDefault();
