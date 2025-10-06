import { db } from "@/lib/firebase";
import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const users = await addDoc(collection(db, "users"), {
    mail: body.mail,
    role: body.role,
  });

  return NextResponse.json(users);
}

export async function GET() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return NextResponse.json(users);
}
