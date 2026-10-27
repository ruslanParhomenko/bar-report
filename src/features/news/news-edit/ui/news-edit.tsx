import FormWrapper from "@/components/wrapper/form-wrapper";
import { useNewsForm } from "@/features/news/news-edit/hooks/useNewsForm";
import { NewsData } from "@/features/news/news-edit/model/schema";
import NewsForm from "@/features/news/news-edit/ui/news-form";
import { useFieldArray } from "react-hook-form";

export function NewsEdit({ data }: { data: NewsData | null }) {
  const { form, onSubmit } = useNewsForm({ data });
  const fieldArray = useFieldArray({ control: form.control, name: "news" });

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <NewsForm fieldArray={fieldArray} />
    </FormWrapper>
  );
}
