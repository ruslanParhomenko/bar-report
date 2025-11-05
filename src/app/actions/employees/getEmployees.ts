// "use server";

// import { db } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { unstable_cache, revalidateTag } from "next/cache";

// const _getEmployees = async () => {
//   const snapshot = await getDocs(collection(db, "employees"));
//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };

// export const getEmployees = unstable_cache(_getEmployees, ["employees"], {
//   revalidate: false,
//   tags: ["employees"],
// });

// export async function invalidateEmployees() {
//   revalidateTag("employees");
// }
