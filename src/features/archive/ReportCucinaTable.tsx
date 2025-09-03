import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportTable({ data: report }: any) {
  return (
    <div className="py-4 px-2 border border-gray-200 rounded-md md:p-4 grid grid-cols-1 mx:auto xl:grid-cols-[33%_33%_33%] gap-4">
      <div className="flex flex-col gap-4">
        <Table className="md:w-120 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-blue-600 w-55">Employees</TableHead>
              <TableHead className="text-blue-600 w-15">Time</TableHead>
              <TableHead className="text-blue-600 w-15">Over</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.shifts?.map((shift: any) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.employees}</TableCell>
                <TableCell>{shift.time}</TableCell>
                <TableCell>{shift.over}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="md:w-120 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-blue-600 w-55">Remains</TableHead>
              <TableHead className="text-blue-600 w-15">p.</TableHead>
              <TableHead className="text-blue-600 w-15">w.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.remains?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.portions}</TableCell>
                <TableCell>{item.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4">
        <Table className="md:w-120 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-blue-600 w-30">Transfer</TableHead>
              <TableHead className="text-blue-600 w-30"></TableHead>
              <TableHead className="text-blue-600 w-15">w.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.movement?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="truncate">{item.nameOutside}</TableCell>
                <TableCell className="truncate">{item.nameInside}</TableCell>
                <TableCell>{item.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table className="md:w-120 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-blue-600 w-55">Write-off</TableHead>
              <TableHead className="text-blue-600 w-15">w.</TableHead>
              <TableHead className="text-blue-600 w-15">reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.writeOff?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.weight}</TableCell>
                <TableCell>{item.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4">
        <Table className="md:w-120 table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-blue-600 w-30">Prepared</TableHead>
              <TableHead className="text-blue-600 w-8">p.</TableHead>
              <TableHead className="text-blue-600 w-8">w.</TableHead>
              <TableHead className="text-blue-600 w-8">time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ...report.preparedSalads,
              ...report.preparedSeconds,
              ...report.preparedDesserts,
              ...report.cutting,
            ]
              ?.filter((item) => item.product)
              .map((item: any, index) => (
                <TableRow key={`${item.id}-${index}`}>
                  <TableCell className="truncate">
                    {item.product || "-"}
                  </TableCell>
                  <TableCell>{item.portions || "-"}</TableCell>
                  <TableCell>{item.weight || "-"}</TableCell>
                  <TableCell className="text-red-600">{item.time}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Table className="md:w-120 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-blue-600 w-30">Staff</TableHead>
              <TableHead className="text-blue-600 w-8">p.</TableHead>
              <TableHead className="text-blue-600  w-8">w.</TableHead>
              <TableHead className="text-blue-600  w-8">time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.staff?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="truncate">{item.product}</TableCell>
                <TableCell>{item.portions || "-"}</TableCell>
                <TableCell>{item.weight || "-"}</TableCell>
                <TableCell>{item?.time || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {report?.notes && <p>Notes: {report.notes}</p>}
    </div>
  );
}
