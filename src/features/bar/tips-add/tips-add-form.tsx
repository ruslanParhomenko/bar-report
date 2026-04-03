import NumericInput from "@/components/inputs-form/numeric-input";
import SelectField from "@/components/inputs-form/select-input";
import { Button } from "@/components/ui/button";

export default function TipsAddForm({
  dataEmployees,
}: {
  dataEmployees: { name: string; id: string; idShift: string | undefined }[];
}) {
  return (
    <div className="flex  gap-6 h-1/3 w-full justify-center items-center">
      {/* <SelectField
        fieldName="employee"
        className="w-80 h-12!"
        placeHolder="...name"
        data={dataEmployees.map((item) => item.name)}
      />
      <NumericInput fieldName="amount" className="w-80 h-12" />
      <SelectField
        fieldName="shift"
        className="w-80 h-12!"
        placeHolder="...type"
        data={["mdl", "chips"]}
      />
      <Button type="button" className="h-12!">
        Добавить
      </Button> */}
    </div>
  );
}
