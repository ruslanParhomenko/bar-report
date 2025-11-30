import { StopListSchemaType } from "./schema";
import dynamic from "next/dynamic";

const StopListForm = dynamic(() => import("./StopListForm"));

export default function StopListPage({ data }: { data: StopListSchemaType }) {
  return (
    <div className="grid xl:grid-cols-2 gap-5 pb-5">
      <StopListForm data={data} nameTag="bar" />
      <StopListForm data={data} nameTag="cucina" />
    </div>
  );
}
