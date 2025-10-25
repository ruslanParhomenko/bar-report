"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";

type MenuItem = {
  product: string;
  description: string[];
};

type StaffMenuData = {
  department: string;
  menu: MenuItem[];
};

export default function StaffMenu({ data }: { data: StaffMenuData }) {
  const form = useForm({ defaultValues: data });
  const values = form.watch();

  return (
    <FormProvider {...form}>
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Меню завтрака — {values.department}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="space-y-4">
            {values.menu.map((item, index) => (
              <li key={index}>
                <div className="font-medium text-base">
                  {index + 1}. {item.product}
                </div>

                {item.description.length > 0 && (
                  <ul className="list-disc list-inside pl-5 mt-1 text-sm text-gray-700 space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
