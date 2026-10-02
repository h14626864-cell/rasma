/**
 * بيانات ديمو لمنصة رسمة — اختيارية تمامًا
 * التشغيل: bunx tsx scripts/seed.ts  (أو bun scripts/seed.ts)
 * بتضيف: حساب أدمن + 3 فنانين تجريبيين + لوحات + استفسارات + طلبات شراء
 *
 * بيانات الأدمن الافتراضية:  01003028980  /  Hamoza@12345
 * لو الفنانين: 01000000001 (hamza) / 01000000002 (sara) / 01000000003 (omar) — كلمة السر: 123456
 */
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  // ===== الأدمن =====
  const adminPhone = process.env.ADMIN_PHONE || "01003028980";
  const adminPass = process.env.ADMIN_PASSWORD || "Hamoza@12345";
  await db.user.upsert({
    where: { phone: adminPhone },
    update: {},
    create: {
      name: "إدارة رسمة",
      slug: "rasma-admin",
      phone: adminPhone,
      password: hashPassword(adminPass),
      role: "ADMIN",
      isGraduate: true,
    },
  });
  console.log("✓ admin ready (phone:", adminPhone + ", password:", adminPass + ")");

  // ===== إعدادات الموقع =====
  await db.siteSetting.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  // ===== فنانين ديمو =====
  const artists = [
    {
      slug: "hamza",
      name: "حمزة الشناوي",
      phone: "01000000001",
      photo: "/demo/p1.png",
      college: "كلية الفنون الجميلة – جامعة القاهرة",
      bio: "رسام تشكيلي، شغال بالزيوت والأكريليك. بستوحى موضوعاتي من حارات القاهرة القديمة وضوء الشمس على الجدران. شاركت في معرضين جماعيين آخر السنة.",
      journey: "بدأت من صغيري وأنا أرسم على حيطان البيت وكراسي الحارة... في كلية الفنون الجميلة اتعلمت الزيت والأكريليك، وبدأت أستوحى من حارات القاهرة القديمة وضوء المغرب. شاركت في معرضين جماعيين للخريجين، ودلوقتي بشتغل على سلسلة عن نوافذ البلد القديمة.",
      passion: "الضوء وقت المغرب — اللحظة اللي بيتحول فيها لون الحيطة من دهبي لبرتقالي. بقعد على السطح كل يوم قبل المغرب بساعة بسجل درجات الألوان، وده اللي بيديني طاقة أرسم.",
      whatsapp: true,
      isGraduate: true,
      views: 348,
      artworks: [
        { title: "حارة الغروب", price: 4500, image: "/demo/art1.png", description: "زيت على قماش، 70×90 سم — حارة مصرية قديمة وقت المغرب", featured: true },
        { title: "النيل بعد المغرب", price: 6200, image: "/demo/art2.png", description: "أكريليك على قماش، 90×120 سم — تجريد حر في لونين", featured: true },
        { title: "رمّان ورمل", price: 3800, image: "/demo/art3.png", description: "زيت على لوح خشب، 60×80 سم — طبيعة صامتة", featured: false },
      ],
    },
    {
      slug: "sara",
      name: "سارة عبد الله",
      phone: "01000000002",
      photo: "/demo/p2.png",
      college: "معهد الفنون الجميلة بالقاهرة",
      bio: "بورتريه وألوان مائية، مهتمة بالوجوه والشخصيات المصرية. بحاول في كل لوحة أوصل إحساس أكتر من الشبه.",
      journey: "من سنة أولى في المعهد ومبعترش بالوجوه — كنت أرسم جدي كل أسبوع لحد ما بقى ده أسلوبي. اتدربت على الألوان المائية مع أستاذة التخصص، وبعدها بدأت أعرض أعمالي في معارض الطلاب.",
      passion: "الوجوه المصرية — عيون الناس اللي بتقول حكاية قبل ما تتكلم. أي وش بيلفت نظري في الشارع بيرسم نفسه في دماغي في دقايق، وأحاول في كل بورتريه أوصل الإحساس أكتر من الشبه.",
      whatsapp: false,
      isGraduate: true,
      views: 512,
      artworks: [
        { title: "بنت من ديرب النجار", price: 5200, image: "/demo/art4.png", description: "حبر وألوان مائية على ورق 300 جم، 50×70 سم", featured: true },
        { title: "عمود من الكرنك", price: 7400, image: "/demo/art5.png", description: "غاش على قماش، 80×100 سم — ضمن سلسلة (حجرة)", featured: false },
      ],
    },
    {
      slug: "omar",
      name: "عمر فتحي",
      phone: "01000000003",
      photo: "/demo/p3.png",
      college: "كلية الفنون الجميلة – جامعة الإسكندرية",
      bio: "لسه طالب سنة رابعة، بجرب بين التجريد والسيريالية، وبيع لوحاتي الأولى من المنصة دي.",
      journey: "لسه في سنة رابعة، وبدأت الرسم بكارتون مضحك في المدرسة، وبعدين اكتشفت السيريالية في مكتبة الكلية واتغيرت حياتي. دلوقتي بجرب بين التجريد والسيريالية، وببيع أول لوحاتي من المنصة دي.",
      passion: "الأحلام — بسجل كل حلم بصحى منو في دفتر صغير، وبيتحول للوحة كل جمعة. أغلب لوحاتي بداها مشهد من حلم نسيت تفاصيله إلا اللون الأحمر.",
      whatsapp: true,
      isGraduate: false,
      views: 176,
      artworks: [
        { title: "قارب أحمر", price: 2900, image: "/demo/art6.png", description: "زيت على قماش، 60×60 سم — تجربة سيريالية هادئة", featured: false },
      ],
    },
  ];

  for (const a of artists) {
    const artist = await db.user.upsert({
      where: { phone: a.phone },
      update: { journey: a.journey, passion: a.passion },
      create: {
        name: a.name,
        slug: a.slug,
        phone: a.phone,
        password: hashPassword("123456"),
        isGraduate: a.isGraduate,
        college: a.college,
        bio: a.bio,
        journey: a.journey,
        passion: a.passion,
        photo: a.photo,
        whatsappEnabled: a.whatsapp,
        whatsappNumber: a.whatsapp ? "0100000000" + a.phone.slice(-1) : "",
        views: a.views,
        role: "ARTIST",
      },
    });

    for (const w of a.artworks) {
      const exists = await db.artwork.findFirst({
        where: { artistId: artist.id, title: w.title },
      });
      if (!exists) {
        await db.artwork.create({
          data: {
            artistId: artist.id,
            title: w.title,
            price: w.price,
            description: w.description,
            image: w.image,
            featured: w.featured,
          },
        });
      }
    }
  }
  console.log("✓ demo artists + artworks ready");

  // ===== استفسارات وطلبات شراء ديمو =====
  const hamza = await db.user.findUnique({ where: { slug: "hamza" } });
  const sara = await db.user.findUnique({ where: { slug: "sara" } });
  if (hamza && sara) {
    const art1 = await db.artwork.findFirst({ where: { artistId: hamza.id, title: "حارة الغروب" } });
    const art4 = await db.artwork.findFirst({ where: { artistId: sara.id, title: "بنت من ديرب النجار" } });

    const inquiryCount = await db.inquiry.count();
    if (inquiryCount === 0) {
      await db.inquiry.create({
        data: {
          artistId: hamza.id,
          artworkId: art1?.id,
          name: "مصطفى كامل",
          phone: "01112223344",
          message: "السلام عليكم، عايز أعرف لوحة «حارة الغروب» لسه متاحة؟ وهل فيه إمكانية تشطيب برواز؟",
        },
      });
      await db.inquiry.create({
        data: {
          artistId: sara.id,
          name: "نورهان عادل",
          phone: "01223334455",
          message: "لوحة «بنت من ديرب النجار» دي عجباني جدًا — ممكن لوحة مشابهة بقياس أكبر؟",
        },
      });
    }

    const purchaseCount = await db.purchaseRequest.count();
    if (purchaseCount === 0) {
      await db.purchaseRequest.create({
        data: {
          artworkId: art4!.id,
          artistId: sara.id,
          buyerName: "أحمد سليم",
          buyerPhone: "01098765432",
          buyerCity: "القاهرة",
          address: "مدينة نصر، شارع عباس العقاد",
          note: "أرجو التواصل بعد الساعة 5 مساءً",
        },
      });
    }
  }
  console.log("✓ demo inquiries + purchases ready");
}

main()
  .then(() => console.log("Seed done ✔"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
