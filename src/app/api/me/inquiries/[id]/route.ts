import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const { id } = await params;
    const inquiry = await db.inquiry.findUnique({ where: { id } });
    if (!inquiry || inquiry.artistId !== current.id) {
      return NextResponse.json({ error: "مش موجودة" }, { status: 404 });
    }
    const updated = await db.inquiry.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json({ inquiry: updated });
  } catch (e) {
    console.error("ME_INQUIRY_READ_ERROR", e);
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
    const inquiry = await db.inquiry.findUnique({ where: { id } });
    if (!inquiry || inquiry.artistId !== current.id) {
      return NextResponse.json({ error: "مش موجودة" }, { status: 404 });
    }
    await db.inquiry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ME_INQUIRY_DELETE_ERROR", e);
    return friendly500(e);
  }
}
