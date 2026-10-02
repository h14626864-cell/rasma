import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

// Public: browse all artworks (for home featured section)
export async function GET() {
  try {
    const artworks = await db.artwork.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 24,
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        image: true,
        createdAt: true,
        artist: {
          select: { id: true, name: true, slug: true, isGraduate: true, college: true },
        },
      },
    });
    return NextResponse.json({ artworks });
  } catch (e) {
    console.error("ARTWORKS_LIST_ERROR", e);
    return friendly500(e);
  }
}
