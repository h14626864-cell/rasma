import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  publicUserSelect,
} from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { normalizeSlug, RESERVED_SLUGS } from "@/lib/slug";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا").max(80).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, "اكتب رقم موبايل صحيح")
    .optional(),
  slug: z.string().trim().max(30).optional(),
  isGraduate: z.boolean().optional(),
  college: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(2000).optional(),
  journey: z.string().trim().max(5000).optional(),
  passion: z.string().trim().max(5000).optional(),
  photo: z.string().max(2_000_000).nullable().optional(),
  whatsappEnabled: z.boolean().optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "كلمة السر الجديدة لازم 6 حروف على الأقل").max(100).optional(),
});

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const user = await db.user.findUnique({
      where: { id: current.id },
      select: publicUserSelect,
    });
    return NextResponse.json({ user });
  } catch {
    return friendly500(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { error: "لازم تسجل دخول الأول" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { currentPassword, newPassword, ...rest } = parsed.data;
    const data: Record<string, unknown> = { ...rest };

    // تغيير اسم البورتفوليو (اللينك)
    if (rest.slug !== undefined) {
      const slug = normalizeSlug(rest.slug);
      if (!slug || RESERVED_SLUGS.has(slug)) {
        return NextResponse.json(
          { error: "اسم البورتفوليو غير متاح" },
          { status: 400 }
        );
      }
      if (slug !== current.slug) {
        const exists = await db.user.findUnique({ where: { slug } });
        if (exists) {
          return NextResponse.json(
            { error: "اسم البورتفوليو ده متاخد" },
            { status: 409 }
          );
        }
      }
      data.slug = slug;
    }

    if (rest.phone && rest.phone !== current.phone) {
      const exists = await db.user.findUnique({ where: { phone: rest.phone } });
      if (exists) {
        return NextResponse.json(
          { error: "الرقم ده مستخدم مع حساب تاني" },
          { status: 409 }
        );
      }
    }

    // تغيير كلمة السر
    if (newPassword) {
      if (!currentPassword || !verifyPassword(currentPassword, current.password)) {
        return NextResponse.json(
          { error: "كلمة السر الحالية غلط" },
          { status: 400 }
        );
      }
      data.password = hashPassword(newPassword);
    }

    const updated = await db.user.update({
      where: { id: current.id },
      data,
      select: publicUserSelect,
    });

    return NextResponse.json({ user: updated });
  } catch (e) {
    console.error("ME_UPDATE_ERROR", e);
    return friendly500(e);
  }
}
