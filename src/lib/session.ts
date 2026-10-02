import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { verifyToken, TOKEN_COOKIE } from "@/lib/auth";

export async function getCurrentUser() {
  try {
    const store = await cookies();
    const token = store.get(TOKEN_COOKIE)?.value;
    const payload = verifyToken(token);
    if (!payload) return null;
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });
    return user;
  } catch {
    return null;
  }
}
