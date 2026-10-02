import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const artist = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        isGraduate: true,
        college: true,
        bio: true,
        photo: true,
        whatsappEnabled: true,
        whatsappNumber: true,
        createdAt: true,
        artworks: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: "الفنان مش موجود" }, { status: 404 });
    }

    return NextResponse.json({ artist });
  } catch (e) {
    console.error("ARTIST_GET_ERROR", e);
    return friendly500(e);
  }
}
