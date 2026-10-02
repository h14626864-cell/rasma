import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const purchaseSchema = z.object({
  artworkId: z.string().min(1),
  buyerName: z.string().trim().min(2, "اكتب اسمك").max(80),
  buyerPhone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, "اكتب رقم موبايل صحيح"),
  buyerCity: z.string().trim().max(60).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  note: z.string().trim().max(1000).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = purchaseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { artworkId, buyerName, buyerPhone, buyerCity, address, note } = parsed.data;

    const artwork = await db.artwork.findUnique({
      where: { id: artworkId },
      include: { artist: true },
    });
    if (!artwork || artwork.artist.role !== "ARTIST" || artwork.artist.status !== "ACTIVE") {
      return NextResponse.json({ error: "اللوحة مش موجودة" }, { status: 404 });
    }
    if (artwork.status === "SOLD") {
      return NextResponse.json(
        { error: "للأسف اللوحة دي اتباعت بالفعل" },
        { status: 409 }
      );
    }

    const purchase = await db.purchaseRequest.create({
      data: {
        artworkId,
        artistId: artwork.artistId,
        buyerName,
        buyerPhone,
        buyerCity,
        address,
        note,
      },
    });

    return NextResponse.json({ purchase }, { status: 201 });
  } catch (e) {
    console.error("PURCHASE_POST_ERROR", e);
    return friendly500(e);
  }
}
