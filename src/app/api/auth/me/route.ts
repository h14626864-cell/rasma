import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicUserSelect } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  const fresh = await db.user.findUnique({
    where: { id: user.id },
    select: publicUserSelect,
  });
  return NextResponse.json({ user: fresh });
}
