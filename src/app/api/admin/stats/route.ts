import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const [
      totalArtists,
      activeArtists,
      suspendedArtists,
      graduates,
      totalArtworks,
      soldArtworks,
      totalInquiries,
      unreadInquiries,
      totalPurchases,
      purchasesByStatus,
      artists,
      artworks,
      purchaseRows,
    ] = await Promise.all([
      db.user.count({ where: { role: "ARTIST" } }),
      db.user.count({ where: { role: "ARTIST", status: "ACTIVE" } }),
      db.user.count({ where: { role: "ARTIST", status: "SUSPENDED" } }),
      db.user.count({ where: { role: "ARTIST", isGraduate: true } }),
      db.artwork.count(),
      db.artwork.count({ where: { status: "SOLD" } }),
      db.inquiry.count(),
      db.inquiry.count({ where: { isRead: false } }),
      db.purchaseRequest.count(),
      db.purchaseRequest.groupBy({ by: ["status"], _count: { _all: true } }),
      db.user.findMany({
        where: { role: "ARTIST" },
        select: {
          id: true,
          name: true,
          slug: true,
          college: true,
          views: true,
          status: true,
          createdAt: true,
          _count: { select: { artworks: true, inquiries: true, purchases: true } },
        },
      }),
      db.artwork.findMany({
        select: { price: true, status: true, createdAt: true, artistId: true },
      }),
      db.purchaseRequest.findMany({
        select: { status: true, createdAt: true, artwork: { select: { price: true } } },
      }),
    ]);

    // قيمة اللوحات
    const catalogValue = artworks.reduce((s, a) => s + a.price, 0);
    const soldValue = artworks
      .filter((a) => a.status === "SOLD")
      .reduce((s, a) => s + a.price, 0);
    const availableValue = catalogValue - soldValue;

    // إجمالي المشاهدات
    const totalViews = artists.reduce((s, a) => s + a.views, 0);

    // نمو التسجيلات آخر 30 يوم (يوم بيوم)
    const now = new Date();
    const signupSeries: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
      signupSeries.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        count: artists.filter(
          (a) => new Date(a.createdAt) >= d && new Date(a.createdAt) < next
        ).length,
      });
    }

    // لوحات حسب الكلية
    const collegeMap = new Map<string, number>();
    artists.forEach((a) => {
      const key = a.college?.trim() || "غير محدد";
      collegeMap.set(key, (collegeMap.get(key) || 0) + (a._count.artworks || 0));
    });
    const artworksByCollege = Array.from(collegeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // أعلى الفنانين مشاهدات
    const topArtists = [...artists]
      .sort((a, b) => b.views - a.views)
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        views: a.views,
        artworks: a._count.artworks,
        inquiries: a._count.inquiries,
        purchases: a._count.purchases,
      }));

    // الفنانون الأكثر تفاعلًا (لوحات + استفسارات + طلبات)
    const mostActive = [...artists]
      .sort(
        (a, b) =>
          b._count.artworks +
          b._count.inquiries +
          b._count.purchases -
          (a._count.artworks + a._count.inquiries + a._count.purchases)
      )
      .slice(0, 6)
      .map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        artworks: a._count.artworks,
        inquiries: a._count.inquiries,
        purchases: a._count.purchases,
      }));

    // آخر تسجيلات
    const recentArtists = await db.user.findMany({
      where: { role: "ARTIST" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        college: true,
        isGraduate: true,
        photo: true,
        status: true,
        createdAt: true,
        _count: { select: { artworks: true } },
      },
    });

    // آخر نشاط (طلبات شراء + استفسارات جديدة)
    const recentPurchases = await db.purchaseRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        artwork: { select: { title: true, price: true } },
        artist: { select: { name: true, slug: true } },
      },
    });
    const recentInquiries = await db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        artist: { select: { name: true, slug: true } },
        artwork: { select: { title: true } },
      },
    });

    return NextResponse.json({
      stats: {
        totalArtists,
        activeArtists,
        suspendedArtists,
        graduates,
        students: totalArtists - graduates,
        totalArtworks,
        soldArtworks,
        availableArtworks: totalArtworks - soldArtworks,
        featuredArtworks: await db.artwork.count({ where: { featured: true } }),
        catalogValue,
        soldValue,
        availableValue,
        totalViews,
        totalInquiries,
        unreadInquiries,
        totalPurchases,
        purchasesNew: purchasesByStatus.find((p) => p.status === "NEW")?._count._all || 0,
        purchasesContacted:
          purchasesByStatus.find((p) => p.status === "CONTACTED")?._count._all || 0,
        purchasesCompleted:
          purchasesByStatus.find((p) => p.status === "COMPLETED")?._count._all || 0,
        purchasesCancelled:
          purchasesByStatus.find((p) => p.status === "CANCELLED")?._count._all || 0,
        completedValue: purchaseRows
          .filter((p) => p.status === "COMPLETED")
          .reduce((s, p) => s + (p.artwork?.price || 0), 0),
      },
      signupSeries,
      artworksByCollege,
      topArtists,
      mostActive,
      recentArtists,
      recentPurchases,
      recentInquiries,
    });
  } catch (e) {
    console.error("ADMIN_STATS_ERROR", e);
    return friendly500(e);
  }
}
