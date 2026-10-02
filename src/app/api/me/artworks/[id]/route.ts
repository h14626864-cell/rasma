import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().trim().min(1, "اكتب اسم اللوحة").max(120).optional(),
  price: z.number().min(0).max(100_000_000).optional(),
  description: z.string().trim().max(2000).optional(),
  image: z.string().max(4_000_000).nullable().optional(),
  status: z.enum(["AVAILABLE", "SOLD"]).optional(),
});

async function getOwnArtwork(id: string, userId: string) {
  const artwork = await db.artwork.findUnique({ where: { id } });
  if (!artwork || artwork.artistId !== userId) return null;
  return artwork;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const { id } = await params;
    const artwork = await getOwnArtwork(id, current.id);
    if (!artwork) {
      return NextResponse.json({ error: "اللوحة مش موجودة" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const updated = await db.artwork.update({
      where: { id },
      data: parsed.data,
      include: { _count: { select: { inquiries: true } } },
    });
    return NextResponse.json({ artwork: updated });
  } catch (e) {
    console.error("ME_ARTWORK_PUT_ERROR", e);
    return friendly500(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const { id } = await params;
    const artwork = await getOwnArtwork(id, current.id);
    if (!artwork) {
      return NextResponse.json({ error: "اللوحة مش موجودة" }, { status: 404 });
    }
    await db.artwork.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ME_ARTWORK_DELETE_ERROR", e);
    return friendly500(e);
  }
}
