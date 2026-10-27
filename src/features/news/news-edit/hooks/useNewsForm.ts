import { createNews } from "@/features/news/news-edit/actions/create-news";
import { useEdit } from "@/providers/edit-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { defaultNews, NewsData, newsSchema } from "../model/schema";

export function useNewsForm({ data }: { data: NewsData | null }) {
  const { setIsEdit } = useEdit();

  const form = useForm<NewsData>({
    resolver: zodResolver(newsSchema),
    defaultValues: data || defaultNews,
  });

  const onSubmit: SubmitHandler<NewsData> = async (data) => {
    await createNews(data);
    toast.success("Новость успешно сохранена!");
    setIsEdit(false);
  };
  return {
    form,
    onSubmit,
  };
}
