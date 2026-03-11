import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";

export const OrderListTTNBar = ({
  data,
}: {
  data: Record<string, string[]>;
}) => {
  const allKeys = Object.keys(data);
  return (
    <div className="columns-1 md:columns-3 lg:columns-7">
      {allKeys.map((key) => (
        <div key={key} className="break-inside-avoid mb-4">
          <OrderCardWrapper data={data[key]} name={key} />
        </div>
      ))}
    </div>
  );
};
