import { Form } from "@/components/ui/form";
import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";
import { useSendTelegram } from "@/hooks/use-send-telegram";
import { useOrderProducts } from "@/providers/order-products-provider";
import { usePathname } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export const OrderListTTNBar = ({
  data,
}: {
  data: Record<string, string[]>;
}) => {
  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";
  const allKeys = Object.keys(data);

  const { sendTelegramMessage } = useSendTelegram();

  const orderProductsData = useOrderProducts()?.ttnBar || {};
  const defaultValuesByKey = Object.fromEntries(
    Object.values(orderProductsData)
      .flat()
      .map((field) => [field, ""]),
  );

  const form = useForm<typeof defaultValuesByKey>({
    defaultValues: defaultValuesByKey,
  });

  const onSubmit: SubmitHandler<typeof defaultValuesByKey> = async (data) => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
    console.log(filtered, "ok");
  };
  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="columns-1 md:columns-3 lg:columns-7">
          {allKeys.map((key) => (
            <div key={key} className="mb-4 break-inside-avoid">
              <OrderCardWrapper data={data[key]} name={key} />
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
};
