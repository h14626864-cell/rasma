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

    const purchases = await db.purchaseRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        artwork: { select: { id: true, title: true, price: true, image: true } },
        artist: { select: { id: true, name: true, slug: true, phone: true } },
      },
    });

    return NextResponse.json({ purchases });
  } catch (e) {
    console.error("ADMIN_PURCHASES_ERROR", e);
    return friendly500(e);
  }
}
