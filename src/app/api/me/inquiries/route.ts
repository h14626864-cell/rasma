import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const inquiries = await db.inquiry.findMany({
      where: { artistId: current.id },
      orderBy: { createdAt: "desc" },
      include: {
        artwork: { select: { id: true, title: true } },
      },
    });
    const unread = inquiries.filter((i) => !i.isRead).length;
    return NextResponse.json({ inquiries, unread });
  } catch (e) {
    console.error("ME_INQUIRIES_ERROR", e);
    return friendly500(e);
  }
}
