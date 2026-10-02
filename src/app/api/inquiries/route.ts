import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  artistId: z.string().min(1),
  artworkId: z.string().optional().nullable(),
  name: z.string().trim().min(2, "اكتب اسمك").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, "اكتب رقم موبايل صحيح"),
  message: z.string().trim().max(2000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { artistId, artworkId, name, phone, message } = parsed.data;

    const artist = await db.user.findUnique({ where: { id: artistId } });
    if (!artist || artist.role !== "ARTIST" || artist.status !== "ACTIVE") {
      return NextResponse.json({ error: "الفنان مش موجود" }, { status: 404 });
    }

    if (artworkId) {
      const artwork = await db.artwork.findUnique({ where: { id: artworkId } });
      if (!artwork || artwork.artistId !== artistId) {
        return NextResponse.json({ error: "اللوحة مش موجودة" }, { status: 404 });
      }
    }

    const inquiry = await db.inquiry.create({
      data: { artistId, artworkId: artworkId || null, name, phone, message },
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (e) {
    console.error("INQUIRY_POST_ERROR", e);
    return friendly500(e);
  }
}
