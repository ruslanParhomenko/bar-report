import { z } from "zod";

export const stopListItemSchema = z.object({
  product: z.string(),
  date: z.string(),
});

export type StopListItemSchemaType = z.infer<typeof stopListItemSchema>;

export const defaultStopList = {
  product: "",
  date: "",
};

export const stopListSchema = z.object({
  stopList: z.array(stopListItemSchema),
});

export type StopListSchemaType = z.infer<typeof stopListSchema>;

export const defaultStopListSchema = {
  stopList: [defaultStopList],
};
