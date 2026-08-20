import { AlgorithmData, FIELD_CONFIG } from "../model/schema";
import AlgorithmTable from "./algorithm-table";

export default function AlgorithmView({
  data,
  tab,
}: {
  data: AlgorithmData | null;
  tab: string;
}) {
  return (
    <>
      {FIELD_CONFIG.map((name) =>
        tab === name ? (
          <div key={name}>
            <AlgorithmTable data={data?.[name]} />
          </div>
        ) : null,
      )}
    </>
  );
}
