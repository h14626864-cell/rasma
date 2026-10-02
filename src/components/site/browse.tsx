"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap, BookOpen, Search, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api, artistUrl, formatPrice, navigate } from "@/lib/client";
import { ArtistListItem } from "@/lib/types";

export function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistListItem[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    api<{ artists: ArtistListItem[] }>("/api/artists")
      .then((d) => setArtists(d.artists))
      .catch(() => setArtists([]));
  }, []);

  const filtered = useMemo(() => {
    if (!artists) return null;
    const term = q.trim();
    if (!term) return artists;
    return artists.filter(
      (a) =>
        a.name.includes(term) ||
        a.college.includes(term) ||
        (a.bio || "").includes(term)
    );
  }, [artists, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            الفنانون
          </h1>
          <p className="text-muted-foreground mt-1">
            {filtered
              ? `${formatPrice(filtered.length)} فنان على المنصة`
              : "جاري التحميل..."}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالاسم أو الكلية..."
            className="pr-9"
            aria-label="بحث عن فنان"
          />
        </div>
      </div>

      {filtered === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground">
            {q ? "مفيش نتائج مطابقة للبحث" : "لسه مفيش فنانين — كن الأول!"}
          </p>
          <Button onClick={() => navigate("/register")}>انضم كفنان</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
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
                    className="h-16 w-16 rounded-2xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-accent text-accent-foreground grid place-items-center text-2xl font-bold font-display shrink-0">
                    {a.name?.[0] || "ف"}
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
                  <p className="text-xs text-primary font-bold mt-2 flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {formatPrice(a._count.artworks)} لوحة
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function ArtworksPage() {
  const [artworks, setArtworks] = useState<ArtworkItem[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    api<{ artworks: ArtworkItem[] }>("/api/artworks")
      .then((d) => setArtworks(d.artworks))
      .catch(() => setArtworks([]));
  }, []);

  const filtered = useMemo(() => {
    if (!artworks) return null;
    const term = q.trim();
    if (!term) return artworks;
    return artworks.filter(
      (w) =>
        w.title.includes(term) ||
        (w.description || "").includes(term) ||
        (w.artist?.name || "").includes(term)
    );
  }, [artworks, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            اللوحات
          </h1>
          <p className="text-muted-foreground mt-1">
            {filtered
              ? `${formatPrice(filtered.length)} لوحة معروضة للبيع`
              : "جاري التحميل..."}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن لوحة..."
            className="pr-9"
            aria-label="بحث عن لوحة"
          />
        </div>
      </div>

      {filtered === null ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground">
            {q ? "مفيش نتائج مطابقة للبحث" : "لسه مفيش لوحات معروضة"}
          </p>
          <Button onClick={() => navigate("/register")}>
            اعمل بورتفوليوك واعرض أول لوحة
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border/70 fan-card-shadow hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div
                className="aspect-square overflow-hidden bg-muted cursor-pointer relative"
                onClick={() => navigate(`/artwork/${w.id}`)}
                role="link"
                aria-label={`صفحة لوحة ${w.title}`}
              >
                {w.image ? (

                  <img
                    src={w.image}
                    alt={w.title}
                    className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      w.status === "SOLD" ? "opacity-70" : ""
                    }`}
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
              <div
                className="p-3 space-y-0.5 flex-1 cursor-pointer"
                onClick={() => navigate(`/artwork/${w.id}`)}
              >
                <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                  {w.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {w.artist?.name}
                </p>
              </div>
              <div className="px-3 pb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-primary">
                  {formatPrice(w.price)} جنيه
                </span>
                <Button
                  size="sm"
                  disabled={w.status === "SOLD"}
                  onClick={() => navigate(`/buy/${w.id}`)}
                >
                  {w.status === "SOLD" ? "تباعت" : "اشتري الآن"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
