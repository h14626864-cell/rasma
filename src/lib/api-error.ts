import { NextResponse } from "next/server";

/**
 * رسايل 500 الموحدة — لو السبب إن قاعدة البيانات مش متوصلة (مستنين Neon)
 * بنقول السبب الحقيقي بدل "حصلت مشكلة".
 */
function isDbDown(e: unknown): boolean {
  const err = e as { name?: string; code?: string; message?: string };
  if (!err) return false;
  const dbInitCodes = ["P1001", "P1002", "P1003", "P1017", "P2021"];
  return (
    err.name === "PrismaClientInitializationError" ||
    (!!err.code && dbInitCodes.includes(err.code)) ||
    /Can't reach database|Environment variable not found|DATABASE_URL/i.test(
      err.message || ""
    )
  );
}

export function friendly500(e: unknown): NextResponse {
  const msg = isDbDown(e)
    ? "قاعدة البيانات مش متوصلة لسه — جاري ربطها حاليًا، جرب تاني بعد شوية"
    : "حصلت مشكلة، جرّب تاني";
  return NextResponse.json({ error: msg }, { status: 500 });
}
