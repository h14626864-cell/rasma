import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  hashPassword,
  signToken,
  TOKEN_COOKIE,
  TOKEN_MAX_AGE,
  publicUserSelect,
} from "@/lib/auth";
import { RESERVED_SLUGS, normalizeSlug } from "@/lib/slug";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, "اكتب رقم موبايل صحيح"),
  password: z.string().min(6, "كلمة السر لازم 6 حروف على الأقل").max(100),
  slug: z
    .string()
    .trim()
    .min(3, "اسم البورتفوليو لازم 3 حروف على الأقل")
    .max(30, "اسم البورتفوليو طويل جدًا"),
  isGraduate: z.boolean().optional().default(true),
  college: z.string().trim().max(120).optional().default(""),
  bio: z.string().trim().max(2000).optional().default(""),
  photo: z.string().max(2_000_000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { name, phone, password, isGraduate, college, bio, photo } = parsed.data;

    // Slug: lowercase latin letters/numbers/dashes only — ده اللي هيبقى في اللينك
    const slug = normalizeSlug(parsed.data.slug);
    if (!slug) {
      return NextResponse.json(
        { error: "اسم البورتفوليو يبقى بحروف إنجليزية صغيرة وأرقام بس (مثال: hamza)" },
        { status: 400 }
      );
    }
    if (RESERVED_SLUGS.has(slug)) {
      return NextResponse.json(
        { error: "الاسم ده محجوز، اختار اسم تاني" },
        { status: 409 }
      );
    }

    const existingPhone = await db.user.findUnique({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json(
        { error: "الرقم ده مسجل قبل كده، جرّب تسجل دخول" },
        { status: 409 }
      );
    }
    const existingSlug = await db.user.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { error: "اسم البورتفوليو ده متاخد، جرّب اسم تاني" },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        slug,
        phone,
        password: hashPassword(password),
        isGraduate,
        college,
        bio,
        photo: photo || null,
        role: "ARTIST",
      },
      select: publicUserSelect,
    });

    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set(TOKEN_COOKIE, signToken(user.id, user.role), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_MAX_AGE,
    });
    return res;
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    return friendly500(e);
  }
}
