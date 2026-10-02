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
    const purchases = await db.purchaseRequest.findMany({
      where: { artistId: current.id },
      orderBy: { createdAt: "desc" },
      include: {
        artwork: { select: { id: true, title: true, price: true, image: true } },
      },
    });
    const newCount = purchases.filter((p) => p.status === "NEW").length;
    return NextResponse.json({ purchases, newCount });
  } catch (e) {
    console.error("ME_PURCHASES_ERROR", e);
    return friendly500(e);
  }
}
