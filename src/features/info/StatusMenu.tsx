"use client";
import PrintButton from "@/components/buttons/PrintButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleData } from "@/hooks/useGoogleData";
import { usePrint } from "@/hooks/useToPrint";
import { useTranslations } from "next-intl";

export default function StatusMenu() {
  const t = useTranslations("Home");
  const columns = [
    { key: "platinum", title: "Platinum" },
    { key: "gold", title: "Gold" },
    { key: "silver", title: "Silver" },
    { key: "loyal", title: "Loyal" },
  ] as const;
  const { statusMenu: data } = useGoogleData();
  const label = [
    "Безалкогольная продукция",
    "Завтраки и десерты",
    "Салаты и закуски",
    "Вторые блюда",
    "Снеки ",
  ];
  const { componentRef, handlePrint } = usePrint({ title: "Table status" });
  return (
    <>
      <PrintButton onPrint={handlePrint} />
      <div
        ref={componentRef}
        className="flex flex-wrap gap-4 w-full  print:h-[200mm]" // A4 height
      >
        {columns.map((col) => (
          <Card
            key={col.key}
            className="rounded-2xl shadow-sm flex-1 min-w-[23%]"
          >
            <CardHeader>
              <CardTitle className="text-center font-bold text-md">
                {col.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {data &&
                  data[col.key].map((item, idx) => (
                    <li
                      key={idx}
                      className={
                        label.includes(item)
                          ? "font-bold text-bl text-center pb-1"
                          : "truncate"
                      }
                    >
                      {item === "-" ? <span> .</span> : item}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { db } from "@/lib/firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// type MenuData = {
//   platinum: string;
//   gold: string;
//   silver: string;
//   loyal: string;
// };

// const options = [
//   "Coca Cola 0.25",
//   "Red Bull",
//   "Энергетик Tiger",
//   "Pepsi",
//   "Sprite",
//   "Fanta",
// ];

// export default function LoyaltyMenuTable() {
//   const [editMode, setEditMode] = useState(false);
//   const [data, setData] = useState<MenuData>({
//     platinum: "",
//     gold: "",
//     silver: "",
//     loyal: "",
//   });

//   // Загружаем данные из Firebase
//   useEffect(() => {
//     const loadData = async () => {
//       const docRef = doc(db, "menus", "loyalty");
//       const snap = await getDoc(docRef);
//       if (snap.exists()) {
//         setData(snap.data() as MenuData);
//       }
//     };
//     loadData();
//   }, []);

//   // Сохраняем данные в Firebase
//   const handleSave = async () => {
//     await setDoc(doc(db, "menus", "loyalty"), data);
//     setEditMode(false);
//   };

//   return (
//     <div className="rounded-md border p-4">
//       <div className="flex justify-end gap-2 mb-2">
//         {editMode ? (
//           <Button onClick={handleSave}>Сохранить</Button>
//         ) : (
//           <Button onClick={() => setEditMode(true)}>Редактировать</Button>
//         )}
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Platinum</TableHead>
//             <TableHead>Gold</TableHead>
//             <TableHead>Silver</TableHead>
//             <TableHead>Loyal</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           <TableRow>
//             {(["platinum", "gold", "silver", "loyal"] as const).map((key) => (
//               <TableCell key={key}>
//                 {editMode ? (
//                   <Select
//                     value={data[key]}
//                     onValueChange={(val) =>
//                       setData((prev) => ({ ...prev, [key]: val }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Выберите..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {options.map((opt) => (
//                         <SelectItem key={opt} value={opt}>
//                           {opt}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   data[key] || "-"
//                 )}
//               </TableCell>
//             ))}
//           </TableRow>
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
