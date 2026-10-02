/**
 * إنشاء حساب الأدمن + إعدادات الموقع فقط (من غير بيانات الديمو)
 * بيتنفذ في بيئة Vercel build — node scripts/seed-admin.mjs
 *
 * آمن 100%:
 * - لو فيه أي أدمن موجود بالفعل → مبيغيرش أي حاجة (كلمة السر بتاعته محترمة)
 * - لو مفيش أدمن:
 *    - لو رقم الأدمن مسجل كفنان → يترقى لأدمن (بنفس كلمة السر بتاعته)
 *    - غير كده → ينشئ أدمن جديد بالبيانات الموثقة (وطالما slug متاخد بيجرّب بدائل)
 */
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const adminPhone = process.env.ADMIN_PHONE || "01003028980";
  const adminPass = process.env.ADMIN_PASSWORD || "Hamoza@12345";

  const adminCount = await db.user.count({ where: { role: "ADMIN" } });
  if (adminCount > 0) {
    console.log(`admin exists (${adminCount}) — skipping creation`);
  } else {
    let slug = "rasma-admin";
    let i = 2;
    while (await db.user.findUnique({ where: { slug } })) {
      slug = `rasma-admin-${i++}`;
    }
    const existing = await db.user.findUnique({ where: { phone: adminPhone } });
    if (existing) {
      await db.user.update({
        where: { phone: adminPhone },
        data: { role: "ADMIN" },
      });
      console.log("existing phone promoted to admin");
    } else {
      await db.user.create({
        data: {
          name: "إدارة رسمة",
          slug,
          phone: adminPhone,
          password: hashPassword(adminPass),
          role: "ADMIN",
          isGraduate: true,
        },
      });
      console.log(`admin created (slug: ${slug})`);
    }
  }

  await db.siteSetting.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  console.log("site settings ready");
}

main()
  .then(() => console.log("seed-admin done"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
