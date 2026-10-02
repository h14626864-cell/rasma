import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const q = searchParams.get("q")?.trim() || "";

    const artworks = await db.artwork.findMany({
      where: {
        ...(status === "AVAILABLE" || status === "SOLD" ? { status } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { artist: { name: { contains: q } } },
                { artist: { slug: { contains: q } } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        image: true,
        status: true,
        featured: true,
        createdAt: true,
        artist: { select: { id: true, name: true, slug: true } },
        _count: { select: { inquiries: true, purchases: true } },
      },
    });

    return NextResponse.json({ artworks });
  } catch (e) {
    console.error("ADMIN_ARTWORKS_ERROR", e);
    return friendly500(e);
  }
}
