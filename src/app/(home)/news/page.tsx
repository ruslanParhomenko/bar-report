import { NewsPage } from "@/features/news";
import { getNewsData } from "@/features/news/news-view/actions/get-news";

export default async function Page() {
  const data = await getNewsData();

  return <NewsPage data={data} />;
}
