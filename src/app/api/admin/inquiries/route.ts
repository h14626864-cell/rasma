import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        artist: { select: { id: true, name: true, slug: true, phone: true } },
        artwork: { select: { title: true, price: true } },
      },
    });

    return NextResponse.json({ inquiries });
  } catch (e) {
    console.error("ADMIN_INQUIRIES_ERROR", e);
    return friendly500(e);
  }
}
