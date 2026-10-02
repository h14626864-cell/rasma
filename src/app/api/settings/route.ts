import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

/** إعدادات الموقع العامة — بتتقري في الصفحة الرئيسية */
export async function GET() {
  try {
    let settings = await db.siteSetting.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await db.siteSetting.create({ data: { id: "main" } });
    }
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("SETTINGS_GET_ERROR", e);
    return friendly500(e);
  }
}
