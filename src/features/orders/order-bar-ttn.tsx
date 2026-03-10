import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";
import OrderPageWrapper from "@/components/wrapper/order-page-wrapper";

export const OrderListTTNBar = ({
  data,
}: {
  data: Record<string, string[]>;
}) => {
  const allKeys = Object.keys(data);
  return (
    <OrderPageWrapper>
      <div
        className="
        h-[88vh]
          columns-1
          sm:columns-2
          md:columns-3
          lg:columns-7
          gap-4
          p-2
        "
      >
        {allKeys.map((key) => (
          <div key={key} className="break-inside-avoid mb-4">
            <OrderCardWrapper data={data[key]} name={key} />
          </div>
        ))}
      </div>
    </OrderPageWrapper>
  );
};
