"use client";
import { useEmployees } from "@/providers/employees-provider";

export default function EmployeePage({ id }: { id: string }) {
  const employees = useEmployees().find((e) => e.id === id);

  return (
    <div className="m-4 grid h-full grid-cols-1 justify-center md:grid-cols-2 md:gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-6">
          <span className="font-bold">Name:</span>
          <span>{employees?.name}</span>
        </div>
        <div className="flex gap-6">
          <span className="font-bold">Role:</span>
          <span>{employees?.role}</span>
        </div>
        <div className="flex gap-6">
          <span className="font-bold">Rate:</span>
          <span>{employees?.rate}</span>
        </div>
        <div className="flex gap-6">
          <span className="font-bold">Mail:</span>
          <span>{employees?.mail}</span>
        </div>
        <div className="flex gap-6">
          <span className="font-bold">Tel:</span>
          <span>{employees?.tel}</span>
        </div>
        <div className="flex gap-6">
          <span className="font-bold">Status:</span>
          <span>{employees?.status}</span>
        </div>
        <div className="flex gap-6">
          <span className="font-bold">Employment Date:</span>
          <span>
            {employees?.employmentDate &&
              new Date(employees.employmentDate).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-6">
          <span className="font-bold">Vacation Pay:</span>
        </div>
        {employees?.vacationPay?.map((item, idx) => {
          if (!item.startDate || !item.endDate) return null;

          const startDate = new Date(item.startDate);
          const endDate = new Date(item.endDate);

          return (
            <div key={idx} className="flex gap-6">
              <span className="font-bold">#{idx + 1}:</span>
              <span>
                {startDate.toLocaleDateString("ru-RU")} —{" "}
                {endDate.toLocaleDateString("ru-RU")}
              </span>
              <span>= {item.countDays} д.</span>
            </div>
          );
        })}
        <div className="flex gap-6">
          <span className="font-bold">Total Days:</span>
          <span>
            {employees?.vacationPay?.reduce(
              (acc, item) => acc + Number(item.countDays || 0),
              0,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
