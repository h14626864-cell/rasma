import { friendly500 } from "@/lib/api-error";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  verifyPassword,
  signToken,
  TOKEN_COOKIE,
  TOKEN_MAX_AGE,
  publicUserSelect,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  phone: z.string().trim().min(5, "اكتب رقم موبايلك"),
  password: z.string().min(1, "اكتب كلمة السر"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { phone, password } = parsed.data;

    const user = await db.user.findUnique({ where: { phone } });
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: "الرقم أو كلمة السر غلط" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        isGraduate: user.isGraduate,
        college: user.college,
        bio: user.bio,
        photo: user.photo,
        whatsappEnabled: user.whatsappEnabled,
        whatsappNumber: user.whatsappNumber,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
    res.cookies.set(TOKEN_COOKIE, signToken(user.id, user.role), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_MAX_AGE,
    });
    return res;
  } catch (e) {
    console.error("LOGIN_ERROR", e);
    return friendly500(e);
  }
}
