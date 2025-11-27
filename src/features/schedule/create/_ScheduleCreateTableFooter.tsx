// import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import { useMemo } from "react";
// import { useFormContext } from "react-hook-form";

// import { useParams } from "next/navigation";
// import { COLOR_SHIFT } from "./constants";

// export default function ScheduleCreateTableFooter({
//   data,
// }: {
//   data: string[];
// }) {
//   const { id } = useParams();
//   const form = useFormContext();
//   const values = form.watch();

//   const shiftCounts = useMemo(() => {
//     if (!values?.rowShifts?.length) return {};

//     const daysCount = values.rowShifts[0]?.shifts?.length || 0;
//     const result = Object.fromEntries(
//       data.map((shift) => [shift, Array(daysCount).fill(0)])
//     );
//     values.rowShifts.forEach((row: any) => {
//       row?.shifts?.forEach((shiftValue: string, dayIndex: number) => {
//         if (!shiftValue) return;

//         const shiftParts = shiftValue.split(".");

//         shiftParts.forEach((part) => {
//           if (data.includes(part)) {
//             result[part][dayIndex] += 1;
//           }
//         });
//       });
//     });

//     return result;
//   }, [values, data]);

//   const colSpan = id ? 7 : 6;

//   return (
//     <TableFooter>
//       {data.map((item, rowIndex) => (
//         <TableRow key={rowIndex} className="h-[16px] p-0 border-0">
//           <TableCell
//             colSpan={colSpan}
//             className="text-end text-muted-foreground h-4 p-0 leading-none text-xs"
//           >
//             {item}
//           </TableCell>

//           {shiftCounts?.[item]?.map((day, index) => (
//             <TableCell
//               key={index}
//               className={cn(
//                 "w-8 text-center h-4 py-0 leading-none text-xs",
//                 COLOR_SHIFT[day as keyof typeof COLOR_SHIFT]
//               )}
//             >
//               {day === 0 ? null : day}
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </TableFooter>
//   );
// }
