import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    const artists = await db.user.findMany({
      where: {
        role: "ARTIST",
        status: "ACTIVE",
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { college: { contains: q } },
                { bio: { contains: q } },
                { slug: { contains: q } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isGraduate: true,
        college: true,
        bio: true,
        photo: true,
        views: true,
        createdAt: true,
        _count: { select: { artworks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ artists });
  } catch (e) {
    console.error("ARTISTS_LIST_ERROR", e);
    return friendly500(e);
  }
}
