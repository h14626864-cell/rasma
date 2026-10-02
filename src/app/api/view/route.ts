import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** عدّاد مشاهدات صفحة الفنان — يتنادى من الصفحة العامة */
export async function POST(req: NextRequest) {
  try {
    const { artistId } = await req.json();
    if (!artistId || typeof artistId !== "string") {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }
    await db.user.update({
      where: { id: artistId },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
