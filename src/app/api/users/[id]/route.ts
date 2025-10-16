import { db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteDoc(doc(db, "users", id));
    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/remarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, role } = body;

  if (!name && !role) {
    return NextResponse.json(
      { error: "No data provided to update" },
      { status: 400 }
    );
  }

  const userRef = doc(db, "users", id);
  await updateDoc(userRef, {
    ...(name !== undefined && { name }),
    ...(role !== undefined && { role }),
  });

  return NextResponse.json({ message: "User updated successfully" });
}
