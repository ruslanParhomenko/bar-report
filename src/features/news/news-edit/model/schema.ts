import z from "zod";

export const newsValueSchema = z.object({
  value: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
});
export const defaultValuesNews: z.infer<typeof newsValueSchema> = {
  value: "",
  createdAt: "",
  expiresAt: "",
};

export const newsSchema = z.object({
  news: z.array(newsValueSchema),
});

export type NewsData = z.infer<typeof newsSchema>;

export const defaultNews: NewsData = {
  news: [defaultValuesNews],
};
