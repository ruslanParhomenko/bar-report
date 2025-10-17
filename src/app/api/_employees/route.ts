// import { db } from "@/lib/firebase";
// import { addDoc, collection, getDocs } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const body = await req.json();

//   const newEmployee = await addDoc(collection(db, "employees"), {
//     name: body.name,
//     role: body.role,
//     rate: body.rate,
//     employmentDate: body.employmentDate,
//     vacationPay: (body.vacationPay || []).map((pay: any) => ({
//       startDate: pay.startDate,
//       endDate: pay.endDate,
//       countDays: pay.countDays,
//     })),
//   });

//   return NextResponse.json({ id: newEmployee.id });
// }

// export async function GET() {
//   const snapshot = await getDocs(collection(db, "employees"));
//   const employees = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   return NextResponse.json(employees);
// }
