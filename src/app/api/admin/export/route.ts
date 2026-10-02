import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const type = new URL(req.url).searchParams.get("type") || "artists";
    let csv = "";
    let filename = "export.csv";

    if (type === "artists") {
      const rows = await db.user.findMany({
        where: { role: "ARTIST" },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { artworks: true, inquiries: true, purchases: true } } },
      });
      csv =
        "\uFEFFالاسم,البورتفوليو,الهاتف,خريج,الكلية,الحالة,المشاهدات,عدد اللوحات,الاستفسارات,طلبات الشراء,تاريخ التسجيل\n" +
        rows
          .map((r) =>
            [
              r.name,
              r.slug,
              r.phone,
              r.isGraduate ? "نعم" : "لا",
              r.college,
              r.status === "ACTIVE" ? "نشط" : "موقوف",
              r.views,
              r._count.artworks,
              r._count.inquiries,
              r._count.purchases,
              new Date(r.createdAt).toLocaleDateString("ar-EG"),
            ]
              .map(csvCell)
              .join(",")
          )
          .join("\n");
      filename = "rasma-artists.csv";
    } else if (type === "artworks") {
      const rows = await db.artwork.findMany({
        orderBy: { createdAt: "desc" },
        include: { artist: { select: { name: true, slug: true } } },
      });
      csv =
        "\uFEFFاللوحة,الفنان,السعر,الحالة,مميزة,عدد الاستفسارات,تاريخ الإضافة\n" +
        rows
          .map((r) =>
            [
              r.title,
              r.artist.name,
              r.price,
              r.status === "SOLD" ? "تباعت" : "متاحة",
              r.featured ? "نعم" : "لا",
              r._count.inquiries,
              new Date(r.createdAt).toLocaleDateString("ar-EG"),
            ]
              .map(csvCell)
              .join(",")
          )
          .join("\n");
      filename = "rasma-artworks.csv";
    } else if (type === "purchases") {
      const rows = await db.purchaseRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          artwork: { select: { title: true, price: true } },
          artist: { select: { name: true } },
        },
      });
      const statusLabel: Record<string, string> = {
        NEW: "جديد",
        CONTACTED: "تم التواصل",
        COMPLETED: "تم البيع",
        CANCELLED: "ملغي",
      };
      csv =
        "\uFEFFاسم المشتري,الهاتف,المدينة,العنوان,اللوحة,السعر,الفنان,الحالة,ملاحظات,التاريخ\n" +
        rows
          .map((r) =>
            [
              r.buyerName,
              r.buyerPhone,
              r.buyerCity,
              r.address,
              r.artwork.title,
              r.artwork.price,
              r.artist.name,
              statusLabel[r.status] || r.status,
              r.note,
              new Date(r.createdAt).toLocaleDateString("ar-EG"),
            ]
              .map(csvCell)
              .join(",")
          )
          .join("\n");
      filename = "rasma-purchases.csv";
    } else {
      return NextResponse.json({ error: "نوع غير معروف" }, { status: 400 });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("ADMIN_EXPORT_ERROR", e);
    return friendly500(e);
  }
}
