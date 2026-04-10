import z from "zod";

export const valueSchema = z.object({
  value: z.string(),
});

export const defaultValues: z.infer<typeof valueSchema> = {
  value: "",
};

export const algorithmSchema = z.object({
  tips: z.array(valueSchema),
  cash: z.array(valueSchema),
  shifts: z.array(valueSchema),
  vip: z.array(valueSchema),
  algorithm: z.array(valueSchema),
  workflow: z.array(valueSchema),
});

export type AlgorithmData = z.infer<typeof algorithmSchema>;

export const defaultAlgorithm: AlgorithmData = {
  tips: [defaultValues],
  cash: [defaultValues],
  shifts: [defaultValues],
  vip: [defaultValues],
  algorithm: [defaultValues],
  workflow: [defaultValues],
};
