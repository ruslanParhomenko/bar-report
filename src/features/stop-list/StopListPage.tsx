import { StopListSchemaType } from "./schema";
import dynamic from "next/dynamic";

const StopListForm = dynamic(() => import("./StopListForm"));

export default function StopListPage({
  data,
  nameTag,
}: {
  data: StopListSchemaType[];
  nameTag: "bar" | "cucina";
}) {
  return <StopListForm data={data} nameTag={nameTag} />;
}
