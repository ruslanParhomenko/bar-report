import { SaveButton } from "@/components/buttons/SaveButton";
import { BreakForm } from "../break/BreakForm";
import { RemarksForm } from "../remarks/RemarksForm";
import { getBreakList } from "@/app/actions/archive/breakListAction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BreakListData } from "@/constants/type";
import { BreakTableByData } from "../break/BreakTableByData";

export async function BreakRemarksPage() {
  const data = await getBreakList();
  return (
    <Tabs defaultValue="form">
      <TabsList>
        <TabsTrigger value="form" className="cursor-pointer">
          Form
        </TabsTrigger>
        <TabsTrigger value="archive" className="cursor-pointer">
          Archive
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form" className="flex flex-col min-h-[90vh] gap-10">
        <BreakForm />
        <RemarksForm />

        <SaveButton />
      </TabsContent>
      <TabsContent value="archive">
        <BreakTableByData data={(data as BreakListData[]) ?? []} />
      </TabsContent>
    </Tabs>
  );
}
