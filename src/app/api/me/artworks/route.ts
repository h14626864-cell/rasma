import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const artworkSchema = z.object({
  title: z.string().trim().min(1, "اكتب اسم اللوحة").max(120),
  price: z.number().min(0, "السعر مش ممكن يكون بالسالب").max(100_000_000),
  description: z.string().trim().max(2000).optional().default(""),
  image: z.string().max(4_000_000).optional().nullable(),
});

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const artworks = await db.artwork.findMany({
      where: { artistId: current.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { inquiries: true } } },
    });
    return NextResponse.json({ artworks });
  } catch (e) {
    console.error("ME_ARTWORKS_GET_ERROR", e);
    return friendly500(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = artworkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { title, price, description, image } = parsed.data;
    const artwork = await db.artwork.create({
      data: { artistId: current.id, title, price, description, image: image || null },
      include: { _count: { select: { inquiries: true } } },
    });
    return NextResponse.json({ artwork }, { status: 201 });
  } catch (e) {
    console.error("ME_ARTWORKS_POST_ERROR", e);
    return friendly500(e);
  }
}
