"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { api, artistUrl, formatDate, formatPrice, navigate, waLink } from "@/lib/client";
import { toast } from "sonner";

interface DetailArtwork {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
  status: string;
  createdAt: string;
  artist: {
    id: string;
    name: string;
    slug: string;
    college: string;
    photo: string | null;
    whatsappEnabled: boolean;
    whatsappNumber: string;
  };
}

interface OtherArtwork {
  id: string;
  title: string;
  price: number;
  image: string | null;
  status: string;
}

export function ArtworkDetail({
  artwork,
  others,
}: {
  artwork: DetailArtwork;
  others: OtherArtwork[];
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = `«${artwork.title}» — ${artwork.artist.name} | رسمة`;
  }, [artwork.title, artwork.artist.name]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("اتنسخ لينك اللوحة");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("مش قادر أنسخ اللينك");
    }
  }

  const isSold = artwork.status === "SOLD";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* رجوع */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/artworks")}
          className="-ml-2"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          كل اللوحات
        </Button>
      </div>

      {/* اللوحة */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* الصورة */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted fan-card-shadow">
            {artwork.image ? (
              <img
                src={artwork.image}
                alt={artwork.title}
                className={`h-full w-full object-cover ${
                  isSold ? "opacity-70" : ""
                }`}
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 opacity-40" />
              </div>
            )}
            {isSold ? (
              <span className="absolute top-4 right-4 rounded-full bg-foreground/85 text-background text-sm font-bold px-4 py-1.5">
                تباعت
              </span>
            ) : null}
          </div>
        </div>

        {/* التفاصيل */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={
                  isSold
                    ? "bg-muted text-muted-foreground border-0"
                    : "bg-chart-3/20 text-[#55663b] border-0"
                }
              >
                {isSold ? "مباعة" : "متاحة للبيع"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                أضيفت {formatDate(artwork.createdAt)}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-snug">
              {artwork.title}
            </h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(artwork.price)}{" "}
              <span className="text-lg font-bold">جنيه</span>
            </p>
          </div>

          {artwork.description ? (
            <div className="rounded-2xl bg-muted/60 p-5">
              <h2 className="font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                عن اللوحة
              </h2>
              <p className="text-foreground/85 leading-loose whitespace-pre-line">
                {artwork.description}
              </p>
            </div>
          ) : null}

          {/* أزرار الشراء والمشاركة */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 h-12 text-base"
              disabled={isSold}
              onClick={() => navigate(`/buy/${artwork.id}`)}
            >
              <ShoppingCart className="h-5 w-5 ml-2" />
              {isSold ? "اللوحة تباعت" : "اشتري الآن"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12"
              onClick={copyLink}
              aria-label="نسخ لينك اللوحة"
            >
              {copied ? (
                <CheckCircle2 className="h-5 w-5 ml-2 text-green-600" />
              ) : (
                <Share2 className="h-5 w-5 ml-2" />
              )}
              شارك اللوحة
            </Button>
          </div>

          {artwork.artist.whatsappEnabled && artwork.artist.whatsappNumber ? (
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <a
                href={waLink(artwork.artist.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 ml-2 text-[#25D366]"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                كلّم الفنان واتساب
              </a>
            </Button>
          ) : null}

          <Separator />

          {/* كارت الفنان */}
          <Card
            className="border-border/70 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(artistUrl(artwork.artist.slug))}
          >
            <CardContent className="p-4 flex items-center gap-4">
              {artwork.artist.photo ? (
                <img
                  src={artwork.artist.photo}
                  alt={artwork.artist.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-border shrink-0"
                />
              ) : (
                <span className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center text-2xl font-bold font-display shrink-0">
                  {artwork.artist.name?.[0] || "ف"}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">الفنان</p>
                <p className="font-bold text-lg truncate">
                  {artwork.artist.name}
                </p>
                {artwork.artist.college ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {artwork.artist.college}
                  </p>
                ) : null}
              </div>
              <Button size="sm" variant="outline" className="shrink-0">
                زيارة صفحته
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* استفسر عن اللوحة */}
      <div className="mt-12">
        <InquiryBox artwork={artwork} />
      </div>

      {/* لوحات تانية من نفس الفنان */}
      {others.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-6">
            لوحات تانية من {artwork.artist.name}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((w) => (
              <div
                key={w.id}
                onClick={() => navigate(`/artwork/${w.id}`)}
                role="link"
                aria-label={`صفحة لوحة ${w.title}`}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border/70 fan-card-shadow hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
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
                <div className="p-3 space-y-0.5">
                  <h3 className="font-bold truncate">{w.title}</h3>
                  <p className="text-sm font-bold text-primary">
                    {formatPrice(w.price)} جنيه
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/* ===== استفسار عن اللوحة ===== */
function InquiryBox({ artwork }: { artwork: DetailArtwork }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await api("/api/inquiries", {
        method: "POST",
        body: {
          artistId: artwork.artist.id,
          artworkId: artwork.id,
          name,
          phone,
          message:
            message ||
            `استفسار عن لوحة «${artwork.title}» — ${formatPrice(artwork.price)} جنيه`,
        },
      });
      setSent(true);
      toast.success("وصل استفسارك — الفنان هيتواصل معاك قريب إن شاء الله");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="border-border/70 fan-paper">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-1">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold">
            عندك سؤال عن «{artwork.title}»؟
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          سيب استفسارك وهيوصلك رد من {artwork.artist.name} مباشرة.
        </p>
        {sent ? (
          <div className="rounded-xl bg-accent text-accent-foreground px-4 py-6 text-center font-bold">
            وصل استفسارك بنجاح — الفنان هيتواصل معاك قريب إن شاء الله
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            className="grid sm:grid-cols-2 gap-4 max-w-3xl"
          >
            <div className="space-y-2">
              <Label htmlFor="awq-name">اسمك</Label>
              <Input
                id="awq-name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: أحمد محمود"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awq-phone">رقم موبايلك</Label>
              <Input
                id="awq-phone"
                required
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="awq-msg">استفسارك (اختياري)</Label>
              <Textarea
                id="awq-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="مثال: اللوحة لسه متاحة؟ القياس كام؟"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 ml-2" />
                    ابعت الاستفسار
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
