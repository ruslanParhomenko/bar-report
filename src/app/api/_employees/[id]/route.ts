// import { db } from "@/lib/firebase";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function DELETE(
//   _req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     await deleteDoc(doc(db, "employees", id));
//     return NextResponse.json({ message: "Employee deleted" });
//   } catch (error) {
//     console.error("DELETE /api/remarks/[id] error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete report" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const body = await req.json();
//   const { name, role, rate, employmentDate, newVacation } = body;

//   const employeeRef = doc(db, "employees", id);

//   const snapshot = await getDocs(collection(db, "employees"));
//   const employeeData = snapshot.docs.find((d) => d.id === id)?.data();

//   if (!employeeData) {
//     return NextResponse.json({ error: "Employee not found" }, { status: 404 });
//   }

//   const updatedVacationPay = [
//     ...(employeeData.vacationPay || []),
//     ...(newVacation
//       ? newVacation.map((pay: any) => ({
//           startDate: pay.startDate,
//           endDate: pay.endDate,
//           countDays: pay.countDays,
//         }))
//       : []),
//   ];

//   await updateDoc(employeeRef, {
//     name: name ?? employeeData.name,
//     role: role ?? employeeData.role,
//     rate: rate ?? employeeData.rate,
//     employmentDate: employmentDate ?? employeeData.employmentDate,
//     vacationPay: updatedVacationPay,
//   });

//   return NextResponse.json({ message: "Employee updated" });
// }
