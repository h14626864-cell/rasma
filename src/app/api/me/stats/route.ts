import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }

    const [artworks, inquiries, purchases, artist] = await Promise.all([
      db.artwork.findMany({ where: { artistId: current.id }, select: { price: true, status: true } }),
      db.inquiry.count({ where: { artistId: current.id } }),
      db.purchaseRequest.count({ where: { artistId: current.id } }),
      db.user.findUnique({
        where: { id: current.id },
        select: { views: true, slug: true, whatsappEnabled: true },
      }),
    ]);

    const newInquiries = await db.inquiry.count({
      where: { artistId: current.id, isRead: false },
    });
    const newPurchases = await db.purchaseRequest.count({
      where: { artistId: current.id, status: "NEW" },
    });
    const soldCount = artworks.filter((a) => a.status === "SOLD").length;
    const soldValue = artworks
      .filter((a) => a.status === "SOLD")
      .reduce((s, a) => s + a.price, 0);
    const availableValue = artworks
      .filter((a) => a.status === "AVAILABLE")
      .reduce((s, a) => s + a.price, 0);

    return NextResponse.json({
      stats: {
        artworks: artworks.length,
        soldCount,
        soldValue,
        availableValue,
        views: artist?.views || 0,
        inquiries,
        newInquiries,
        purchases,
        newPurchases,
        slug: artist?.slug || current.slug,
        whatsappEnabled: artist?.whatsappEnabled || false,
      },
    });
  } catch (e) {
    console.error("ME_STATS_ERROR", e);
    return friendly500(e);
  }
}
