"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  PartyPopper,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { api, formatPrice } from "@/lib/client";

interface BuyArtwork {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
  status: string;
  artist: {
    id: string;
    name: string;
    slug: string;
    college: string;
    photo: string | null;
  };
}

export function BuyForm({ artwork }: { artwork: BuyArtwork }) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerCity, setBuyerCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const sold = artwork.status === "SOLD";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api("/api/purchases", {
        method: "POST",
        body: {
          artworkId: artwork.id,
          buyerName,
          buyerPhone,
          buyerCity,
          address,
          note,
        },
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Card className="border-border/70 fan-paper">
          <CardContent className="p-8 sm:p-12 text-center space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-accent grid place-items-center">
              <PartyPopper className="h-10 w-10 text-accent-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">
              وصل طلبك بنجاح!
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              طلب شراء لوحة «{artwork.title}» وصل للفنان {artwork.artist.name}،
              وهيتواصل معاك على الرقم اللي سجلته في أقرب وقت لترتيب الدفع
              والتسليم.
            </p>
            <div className="rounded-xl bg-secondary/70 px-4 py-3 text-sm text-secondary-foreground inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              احتفظ برقم موبايلك — هو وسيلة التواصل بينكم
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          طلب شراء اللوحة
        </h1>
        <p className="text-muted-foreground">
          املا بياناتك والفنان هيتواصل معاك لترتيب الشراء
        </p>
      </div>

      {sold ? (
        <Card className="border-destructive/40">
          <CardContent className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-xl font-bold">للأسف اللوحة دي اتباعت بالفعل</p>
            <p className="text-muted-foreground">
              تابع باقي لوحات الفنان، ممكن يعجبك حاجة تانية.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* ملخص اللوحة */}
          <Card className="border-border/70 fan-paper md:sticky md:top-6">
            <CardContent className="p-5 space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border/60">
                {artwork.image ? (
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-muted-foreground">
                    <ShoppingCart className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold">
                  {artwork.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {artwork.artist.photo ? (
                    <img
                      src={artwork.artist.photo}
                      alt={artwork.artist.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : null}
                  الفنان {artwork.artist.name}
                  {artwork.artist.college ? ` — ${artwork.artist.college}` : ""}
                </div>
                {artwork.description ? (
                  <p className="text-sm text-foreground/70 leading-relaxed pt-1">
                    {artwork.description}
                  </p>
                ) : null}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">سعر اللوحة</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(artwork.price)} جنيه
                </span>
              </div>
            </CardContent>
          </Card>

          {/* فورم البيانات */}
          <Card className="border-border/70">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="b-name">اسمك بالكامل *</Label>
                  <Input
                    id="b-name"
                    required
                    minLength={2}
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="مثال: محمد أحمد علي"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-phone">رقم الموبايل *</Label>
                  <Input
                    id="b-phone"
                    required
                    inputMode="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                  />
                  <p className="text-xs text-muted-foreground">
                    الفنان هيتواصل معاك على الرقم ده.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-city">المدينة / المحافظة</Label>
                  <Input
                    id="b-city"
                    value={buyerCity}
                    onChange={(e) => setBuyerCity(e.target.value)}
                    placeholder="مثال: القاهرة"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-address">العنوان (للتوصيل)</Label>
                  <Textarea
                    id="b-address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="العنوان بالتفصيل لو عايز التوصيل للمنزل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-note">ملاحظات للفنان</Label>
                  <Textarea
                    id="b-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="أي تفاصيل إضافية — طريقة الدفع، وقت التواصل المناسب..."
                  />
                </div>

                {error ? (
                  <p className="text-sm text-destructive font-bold">{error}</p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={sending}
                  className="w-full"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin ml-2" />
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      تأكيد طلب الشراء
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  الطلب بيوصلك للفنان فورًا في لوحة تحكمه
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
