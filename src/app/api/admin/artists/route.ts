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

    const artists = await db.user.findMany({
      where: { role: "ARTIST" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        isGraduate: true,
        college: true,
        bio: true,
        photo: true,
        whatsappEnabled: true,
        status: true,
        suspendReason: true,
        views: true,
        createdAt: true,
        _count: { select: { artworks: true, inquiries: true, purchases: true } },
      },
    });

    return NextResponse.json({ artists });
  } catch (e) {
    console.error("ADMIN_ARTISTS_ERROR", e);
    return friendly500(e);
  }
}
