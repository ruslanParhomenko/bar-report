import { USERS_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { redis } from "@/lib/redis";
import { unstable_cache } from "next/cache";
import { UserForm } from "../model/schema";

const TAG = USERS_ACTION_TAG;

export type GetUserData = UserForm & {
  id: string;
};

export async function _getUsers(): Promise<GetUserData[]> {
  const cached = await redis.get<GetUserData[]>(TAG);
  if (cached) return cached;

  const snapshot = await dbAdmin.collection(TAG).get();
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GetUserData[];

  await redis.set(TAG, users);
  return users;
}

export const getUsers = unstable_cache(_getUsers, [TAG], {
  revalidate: false,
  tags: [TAG],
});
