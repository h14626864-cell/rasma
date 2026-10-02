"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Image as ImageIcon,
  Mail,
  MapPin,
  Send,
  ShoppingCart,
  Loader2,
  Eye,
  Route,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { api, formatDate, formatPrice, navigate, waLink } from "@/lib/client";
import { toast } from "sonner";

interface PortfolioArtist {
  id: string;
  name: string;
  slug: string;
  isGraduate: boolean;
  college: string;
  bio: string;
  journey: string;
  passion: string;
  photo: string | null;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  views: number;
  createdAt: string;
  artworks: {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string | null;
    status: string;
    createdAt: string;
  }[];
}

/** WhatsApp floating button (bottom-left) */
function WhatsAppFloat({ phone }: { phone: string }) {
  return (
    <a
      href={waLink(phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-4 pr-3 py-3 shadow-xl hover:scale-105 hover:shadow-2xl transition-all"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
      <span className="text-sm font-bold">كلّمني واتساب</span>
    </a>
  );
}

export function ArtistPortfolio({ artist }: { artist: PortfolioArtist }) {
  const [contactOpen, setContactOpen] = useState(false);

  // عدّاد المشاهدات — مرة واحدة زيارة لكل تحميل صفحة
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId: artist.id }),
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== Nav bar: للفنان فقط — مفيش اسم المنصة ===== */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {artist.photo ? (
              <img
                src={artist.photo}
                alt={artist.name}
                className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
              />
            ) : (
              <span className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold font-display shrink-0">
                {artist.name?.[0] || "ر"}
              </span>
            )}
            <div className="min-w-0 leading-tight">
              <span className="font-display block text-xl font-bold truncate">
                {artist.name}
              </span>
              {artist.college ? (
                <span className="hidden sm:block text-[11px] text-muted-foreground truncate">
                  {artist.college}
                </span>
              ) : null}
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContactOpen(true)}
            >
              <Mail className="h-4 w-4 ml-2" />
              تواصل
            </Button>
            <Button size="sm" onClick={() => setContactOpen(false) || scrollToGallery()}>
              <ImageIcon className="h-4 w-4 ml-2" />
              اللوحات
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="fan-paper border-b border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {artist.photo ? (
                <img
                  src={artist.photo}
                  alt={artist.name}
                  className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl object-cover border-4 border-card fan-card-shadow shrink-0"
                />
              ) : (
                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl bg-primary text-primary-foreground grid place-items-center text-6xl font-bold font-display shrink-0 fan-card-shadow">
                  {artist.name?.[0] || "ر"}
                </div>
              )}
              <div className="flex-1 text-center sm:text-right space-y-3">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                  <h1 className="font-display text-4xl sm:text-5xl font-bold">
                    {artist.name}
                  </h1>
                  {artist.isGraduate ? (
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      خريج
                    </Badge>
                  ) : (
                    <Badge className="bg-chart-2 text-white gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      طالب
                    </Badge>
                  )}
                </div>
                {artist.college ? (
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {artist.college}
                  </p>
                ) : null}
                {artist.bio ? (
                  <p className="text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-line">
                    {artist.bio}
                  </p>
                ) : null}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1" suppressHydrationWarning>
                    <Eye className="h-3.5 w-3.5" />
                    {formatPrice(artist.views + 1)} مشاهدة
                  </span>
                  <span suppressHydrationWarning>
                    عضو منذ {formatDate(artist.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Story: رحلتي + شغفي ===== */}
        {artist.journey?.trim() || artist.passion?.trim() ? (
          <section className="fan-paper border-y border-border/60">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className={`grid gap-5 ${artist.journey?.trim() && artist.passion?.trim() ? "md:grid-cols-2" : ""}`}>
                {artist.journey?.trim() ? (
                  <Card className="border-border/70 bg-card/90">
                    <CardContent className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                          <Route className="h-5 w-5 text-primary" />
                        </span>
                        <h2 className="font-display text-2xl font-bold">
                          رحلتي في الفن
                        </h2>
                      </div>
                      <p className="text-foreground/85 leading-loose whitespace-pre-line">
                        {artist.journey}
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
                {artist.passion?.trim() ? (
                  <Card className="border-border/70 bg-card/90">
                    <CardContent className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-10 w-10 rounded-xl bg-chart-2/20 grid place-items-center shrink-0">
                          <Flame className="h-5 w-5 text-[#8a6a14]" />
                        </span>
                        <h2 className="font-display text-2xl font-bold">شغفي</h2>
                      </div>
                      <p className="text-foreground/85 leading-loose whitespace-pre-line">
                        {artist.passion}
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== Artworks ===== */}
        <section id="gallery" className="mx-auto max-w-6xl px-4 py-12 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-2xl font-bold">لوحاتي</h2>
            <Badge variant="secondary">
              {formatPrice(artist.artworks.length)}
            </Badge>
          </div>

          {artist.artworks.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
              لسه مفيش لوحات معروضة — تابعنا قريب
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {artist.artworks.map((w) => (
                <div
                  key={w.id}
                  className="group rounded-2xl overflow-hidden bg-card border border-border/70 fan-card-shadow hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                >
                  <div
                    className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
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
                        <ImageIcon className="h-10 w-10" />
                      </div>
                    )}
                    <span className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-sm font-bold text-primary shadow">
                      {formatPrice(w.price)} جنيه
                    </span>
                    {w.status === "SOLD" ? (
                      <span className="absolute top-3 left-3 rounded-full bg-foreground/80 text-background text-xs font-bold px-2.5 py-1">
                        تباعت
                      </span>
                    ) : null}
                  </div>
                  <div
                    className="p-4 flex-1 space-y-1.5 cursor-pointer"
                    onClick={() => navigate(`/artwork/${w.id}`)}
                  >
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {w.title}
                    </h3>
                    {w.description ? (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {w.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="p-4 pt-0">
                    <Button
                      className="w-full"
                      disabled={w.status === "SOLD"}
                      onClick={() => navigate(`/buy/${w.id}`)}
                    >
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      {w.status === "SOLD" ? "تباعت" : "اشتري الآن"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== Contact ===== */}
        <section id="contact" className="mx-auto max-w-6xl px-4 pb-14 scroll-mt-20">
          <Card className="border-border/70">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-1">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold">
                  تواصل مع {artist.name}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                عندك سؤال أو عرض؟ سيب رسالتك وهيوصله في لوحة تحكمه.
              </p>
              <ContactForm artistId={artist.id} />
              <Separator className="my-6" />
              <p className="text-xs text-muted-foreground text-center">
                لو حابب تشتري لوحة معينة، اضغط «اشتري الآن» تحت اللوحة واملا
                بياناتك.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/70 py-6 text-center text-sm text-muted-foreground" suppressHydrationWarning>
        © {new Date().getFullYear()} {artist.name} — كل الحقوق محفوظة
      </footer>

      {/* WhatsApp float */}
      {artist.whatsappEnabled && artist.whatsappNumber ? (
        <WhatsAppFloat phone={artist.whatsappNumber} />
      ) : null}

      {/* Contact dialog (mobile quick access) */}
      {contactOpen ? (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto fan-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl font-bold">
              تواصل مع {artist.name}
            </h3>
            <ContactForm artistId={artist.id} compact />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function scrollToGallery() {
  document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
}

function ContactForm({
  artistId,
  compact = false,
}: {
  artistId: string;
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await api("/api/inquiries", {
        method: "POST",
        body: { artistId, name, phone, message },
      });
      setSent(true);
      setName("");
      setPhone("");
      setMessage("");
      toast.success("وصلت رسالتك — الفنان هيتواصل معاك قريب إن شاء الله");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-accent text-accent-foreground px-4 py-6 text-center font-bold">
        وصلت رسالتك بنجاح — الفنان هيتواصل معاك قريب إن شاء الله
      </div>
    );
  }

  return (
    <form onSubmit={handleContact} className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`c-name-${artistId}`}>اسمك</Label>
        <Input
          id={`c-name-${artistId}`}
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: أحمد محمود"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`c-phone-${artistId}`}>رقم موبايلك</Label>
        <Input
          id={`c-phone-${artistId}`}
          required
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01xxxxxxxxx"
        />
      </div>
      <div className={`space-y-2 ${compact ? "sm:col-span-2" : "sm:col-span-2"}`}>
        <Label htmlFor={`c-msg-${artistId}`}>رسالتك</Label>
        <Textarea
          id={`c-msg-${artistId}`}
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب استفسارك أو عرضك هنا..."
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={sending} className="w-full sm:w-auto">
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 ml-2" />
              إرسال
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
