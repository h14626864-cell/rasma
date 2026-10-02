"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Inbox,
  Image as ImageIcon,
  Sparkles,
  UserRoundPlus,
  GraduationCap,
  BookOpen,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, artistUrl, formatPrice, navigate } from "@/lib/client";
import { ArtistListItem, ArtworkItem, SiteSettings } from "@/lib/types";

function HeroCollage({ artworks }: { artworks: ArtworkItem[] }) {
  const pics = artworks.filter((a) => a.image).slice(0, 3);
  if (pics.length === 0) {
    return (
      <div className="relative h-80">
        <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-accent via-secondary to-muted" />
      </div>
    );
  }
  return (
    <div className="relative h-[320px] sm:h-[380px] select-none" aria-hidden="true">
      <div
        className="absolute top-2 right-2 sm:right-6 w-44 sm:w-56 aspect-square rounded-2xl overflow-hidden fan-card-shadow rotate-6 transition-transform hover:rotate-3 hover:scale-[1.03] duration-300"
      >
        <img src={pics[0].image!} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        className="absolute bottom-2 left-2 sm:left-6 w-44 sm:w-56 aspect-square rounded-2xl overflow-hidden fan-card-shadow -rotate-6 transition-transform hover:rotate-[-2deg] hover:scale-[1.03] duration-300"
      >
        <img src={pics[1]?.image || pics[0].image!} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 aspect-square rounded-2xl overflow-hidden fan-card-shadow z-10 ring-8 ring-background"
      >
        <img src={pics[2]?.image || pics[0].image!} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export function Home() {
  const [artists, setArtists] = useState<ArtistListItem[] | null>(null);
  const [artworks, setArtworks] = useState<ArtworkItem[] | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api<{ artists: ArtistListItem[] }>("/api/artists")
      .then((d) => setArtists(d.artists))
      .catch(() => setArtists([]));
    api<{ artworks: ArtworkItem[] }>("/api/artworks")
      .then((d) => setArtworks(d.artworks))
      .catch(() => setArtworks([]));
    api<{ settings: SiteSettings }>("/api/settings")
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  const totalArtworks = artworks?.length ?? 0;

  return (
    <div>
      {/* ===== Announcement ===== */}
      {settings?.announcement ? (
        <div className="bg-primary text-primary-foreground text-center text-sm font-bold px-4 py-2.5">
          {settings.announcement}
        </div>
      ) : null}

      {/* ===== Hero ===== */}
      <section className="fan-paper border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Badge variant="secondary" className="text-sm px-3 py-1 gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              منصة خريجي وطلاب الفنون الجميلة
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.25]">
              {settings?.heroTitle ? (
                settings.heroTitle
              ) : (
                <>
                  فنّك يستاهل
                  <span className="text-primary"> يتشاف</span>
                </>
              )}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {settings?.heroSubtitle ? (
                settings.heroSubtitle
              ) : (
                <>
                  اعمل بورتفوليو باسمك ولينك خاص بيك زي{" "}
                  <span dir="ltr" className="font-bold text-foreground">
                    rasma-plum.vercel.app/artist/hamza
                  </span>{" "}
                  — اعرض لوحاتك بالأسعار، واستقبل طلبات الشراء من الجمهور
                  والجاليريات.
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/register")}>
                <UserRoundPlus className="h-5 w-5 ml-2" />
                اعمل بورتفوليوك دلوقتي
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/artists")}>
                تصفح الفنانين
                <ArrowLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
            <div className="flex gap-8 pt-2">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {artists ? formatPrice(artists.length) : "—"}
                </div>
                <div className="text-sm text-muted-foreground">فنان مسجل</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {artworks ? formatPrice(totalArtworks) : "—"}
                </div>
                <div className="text-sm text-muted-foreground">لوحة معروضة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">مجانًا</div>
              </div>
            </div>
          </div>
          <div className="animate-in fade-in zoom-in-95 duration-700">
            {artworks === null ? (
              <Skeleton className="h-[320px] sm:h-[380px] rounded-3xl" />
            ) : (
              <HeroCollage artworks={artworks} />
            )}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl font-bold text-center">
          إزاي بتشتغل؟
        </h2>
        <p className="text-center text-muted-foreground mt-2 mb-8">
          تلات خطوات بسيطة وفنّك قدام العالم
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: UserRoundPlus,
              title: "سجّل مجانًا",
              desc: "اسمك، رقمك، كليتك، نبذة عنك — واختار اسم البورتفوليو اللي هيبقى في لينكك.",
            },
            {
              icon: Link2,
              title: "لينكك الخاص بيك",
              desc: "بورتفوليوك بيبقى له عنوان مستقل باسمك، من غير اسم المنصة — انت ولوحاتك بس.",
            },
            {
              icon: Inbox,
              title: "استقبل الطلبات",
              desc: "أي زائر مهتم يبعتلك طلب شراء أو استفسار — بيوصلك فورًا في لوحة تحكمك.",
            },
          ].map((s, i) => (
            <Card
              key={s.title}
              className="border-border/70 bg-card hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-accent text-accent-foreground grid place-items-center">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="text-xs font-bold text-primary">
                  الخطوة {formatPrice(i + 1)}
                </div>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== Featured artists ===== */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">فنانون مميزون</h2>
              <p className="text-muted-foreground mt-1">
                تعرّف على مواهب من كليات الفنون الجميلة
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/artists")}>
              كل الفنانين
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Button>
          </div>
          {artists === null ? (
            <div className="grid sm:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لسه مفيش فنانين مسجلين — ممكن تكون الإنت الأول!
            </p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-5">
              {artists.slice(0, 3).map((a) => (
                <Card
                  key={a.id}
                  className="border-border/70 bg-card cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  onClick={() => (window.location.href = artistUrl(a.slug))}
                >
                  <CardContent className="p-5 flex items-start gap-4">
                    {a.photo ? (
                      <img
                        src={a.photo}
                        alt={a.name}
                        className="h-16 w-16 rounded-2xl object-cover border border-border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-accent text-accent-foreground grid place-items-center text-2xl font-bold font-display shrink-0">
                        {a.name?.[0] || "ر"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg truncate">{a.name}</h3>
                        {a.isGraduate ? (
                          <Badge className="bg-primary/10 text-primary border-0 gap-1">
                            <GraduationCap className="h-3 w-3" />
                            خريج
                          </Badge>
                        ) : (
                          <Badge className="bg-chart-2/20 text-[#8a6a14] border-0 gap-1">
                            <BookOpen className="h-3 w-3" />
                            طالب
                          </Badge>
                        )}
                      </div>
                      {a.college ? (
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">
                          {a.college}
                        </p>
                      ) : null}
                      <p className="text-sm mt-1.5 text-muted-foreground line-clamp-2 leading-relaxed">
                        {a.bio || "فنان تشكيلي"}
                      </p>
                      <p className="text-xs text-primary font-bold mt-2" dir="ltr">
                        {a.slug}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Featured artworks ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">لوحات معروضة</h2>
            <p className="text-muted-foreground mt-1">
              آخر الأعمال اللي اتحطت على المنصة
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/artworks")}>
            كل اللوحات
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
        </div>
        {artworks === null ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            لسه مفيش لوحات — سجل كفنان واعرض أول لوحة.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {artworks.slice(0, 8).map((w) => (
              <div
                key={w.id}
                onClick={() => navigate(`/artwork/${w.id}`)}
                role="link"
                aria-label={`صفحة لوحة ${w.title}`}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/70 fan-card-shadow hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square overflow-hidden bg-muted relative">
                  {w.image ? (
                    <img
                      src={w.image}
                      alt={w.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  {w.status === "SOLD" ? (
                    <span className="absolute top-2 right-2 rounded-full bg-foreground/80 text-background text-xs font-bold px-2.5 py-1">
                      تباعت
                    </span>
                  ) : null}
                </div>
                <div className="p-3 space-y-0.5">
                  <h3 className="font-bold truncate">{w.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {w.artist?.name}
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {formatPrice(w.price)} جنيه
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-primary text-primary-foreground px-6 py-12 sm:px-12 text-center relative overflow-hidden">
          <div
            className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-black/10 blur-2xl"
            aria-hidden="true"
          />
          <h2 className="font-display text-3xl sm:text-4xl font-bold relative">
            جاهز تعرض موهبتك للعالم؟
          </h2>
          <p className="mt-3 text-primary-foreground/85 max-w-xl mx-auto relative leading-relaxed">
            سجل دلوقتي مجانًا تمامًا، واعمل بورتفوليوك الخاص بلينك مستقل — وخلّي
            أي حد يشوف ويشتري فنّك.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6 relative"
            onClick={() => navigate("/register")}
          >
            <UserRoundPlus className="h-5 w-5 ml-2" />
            ابدأ دلوقتي
          </Button>
        </div>
      </section>
    </div>
  );
}
