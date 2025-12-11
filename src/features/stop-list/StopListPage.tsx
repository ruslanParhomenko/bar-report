import { StopListSchemaType } from "./schema";
import StopListForm from "./StopListForm";

export default function StopListPage({
  data,
  nameTag,
}: {
  data: StopListSchemaType[];
  nameTag: "bar" | "cucina";
}) {
  return <StopListForm data={data} nameTag={nameTag} />;
}
