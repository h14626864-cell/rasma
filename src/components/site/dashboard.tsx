"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  UserRound,
  Image as ImageIcon,
  Inbox,
  Phone,
  ShoppingBag,
  MessageSquare,
  Eye,
  GraduationCap,
  BookOpen,
  MessageCircle,
  RotateCcw,
  LayoutDashboard,
  Link2,
  Copy,
  CheckCircle2,
  Wallet,
  BarChart3,
  Globe,
  PackageCheck,
  Ban,
  Route,
  Send,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api, artistUrl, formatDate, formatPrice, navigate, waLink } from "@/lib/client";
import { AppealItem, ArtworkItem, InquiryItem, MeStats, PurchaseItem, PublicUser } from "@/lib/types";
import { useAuth } from "./auth";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";

/* ================= Profile tab ================= */
function ProfileTab() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [slug, setSlug] = useState(user?.slug || "");
  const [isGraduate, setIsGraduate] = useState(
    user?.isGraduate ? "yes" : "no"
  );
  const [college, setCollege] = useState(user?.college || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [journey, setJourney] = useState(user?.journey || "");
  const [passion, setPassion] = useState(user?.passion || "");
  const [photo, setPhoto] = useState<string | null>(user?.photo || null);
  const [waEnabled, setWaEnabled] = useState(user?.whatsappEnabled || false);
  const [waNumber, setWaNumber] = useState(user?.whatsappNumber || "");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api<{ user: PublicUser }>("/api/me", {
        method: "PUT",
        body: {
          name,
          phone,
          slug,
          isGraduate: isGraduate === "yes",
          college,
          bio,
          journey,
          passion,
          photo,
          whatsappEnabled: waEnabled,
          whatsappNumber: waNumber,
        },
      });
      setUser(data.user);
      toast.success("اتحفظت بياناتك بنجاح");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            بياناتك الشخصية
          </CardTitle>
          <CardDescription>
            دي البيانات اللي بتظهر في بورتفوليوك العام — عدلها براحتك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p-name">الاسم</Label>
              <Input
                id="p-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-phone">رقم الموبايل</Label>
              <Input
                id="p-phone"
                required
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-slug">اسم البورتفوليو (اللينك الخاص بيك)</Label>
            <Input
              id="p-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              dir="ltr"
              className="text-left"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              لينك بورتفوليوك: <span dir="ltr" className="font-bold">{slug || "..."}</span> — لو غيّرته، اللينك القديم مش هيشتغل تاني.
            </p>
          </div>

          <div className="space-y-2">
            <Label>إنت خريج ولا طالب؟</Label>
            <RadioGroup
              value={isGraduate}
              onValueChange={setIsGraduate}
              className="grid grid-cols-2 gap-3"
            >
              <label
                className={`flex items-center gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition ${
                  isGraduate === "yes"
                    ? "border-primary bg-accent/60"
                    : "border-border"
                }`}
              >
                <RadioGroupItem value="yes" id="pd-grad" />
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-bold">خريج</span>
              </label>
              <label
                className={`flex items-center gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition ${
                  isGraduate === "no"
                    ? "border-primary bg-accent/60"
                    : "border-border"
                }`}
              >
                <RadioGroupItem value="no" id="pd-student" />
                <BookOpen className="h-5 w-5 text-chart-2" />
                <span className="font-bold">طالب</span>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-college">الكلية أو المعهد</Label>
            <Input
              id="p-college"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-bio">نبذة عنك</Label>
            <Textarea
              id="p-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="اكتب عن أسلوبك الفني..."
            />
          </div>

          <div className="rounded-2xl border border-border bg-accent/30 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              <p className="font-bold">قصتك الفنية — تظهر في صفحتك العامة</p>
            </div>
            <p className="text-sm text-muted-foreground -mt-2">
              املأها اللي تحب — وأي حاجة مسيبها فضية مش هتظهر في صفحتك.
            </p>
            <div className="space-y-2">
              <Label htmlFor="p-journey">رحلتي في الفن</Label>
              <Textarea
                id="p-journey"
                rows={4}
                value={journey}
                onChange={(e) => setJourney(e.target.value)}
                placeholder="احكي إزاي بدأت رحلتك مع الفن... أول مرة مسكت فرشاية إمتى؟ ومررت بإيه حتى وصلت لأسلوبك الحالي؟"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-passion">شغفي</Label>
              <Textarea
                id="p-passion"
                rows={3}
                value={passion}
                onChange={(e) => setPassion(e.target.value)}
                placeholder="إيه اللي بيحركك إنك ترسم؟ إيه الشغف اللي ملاه؟ الموضوع اللي بترجعله دايمًا؟"
              />
            </div>
          </div>

          <ImageUpload
            value={photo}
            onChange={setPhoto}
            label="صورتك الشخصية (اختياري)"
          />
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            زرار الواتساب
          </CardTitle>
          <CardDescription>
            لو فعّالته، هيظهر زرار واتساب تحت شمال في بورتفوليوك — أي زائر يقدر
            يكلمك على طول.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <Label htmlFor="wa-switch" className="text-base font-bold">
                تفعيل زرار الواتساب في صفحتك
              </Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {waEnabled ? "مفعّل — الزوار هيلاقوا الزرار" : "متوقف حاليًا"}
              </p>
            </div>
            <Switch
              id="wa-switch"
              checked={waEnabled}
              onCheckedChange={setWaEnabled}
            />
          </div>
          {waEnabled ? (
            <div className="space-y-2">
              <Label htmlFor="wa-number">رقم الواتساب</Label>
              <Input
                id="wa-number"
                inputMode="tel"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                placeholder="01xxxxxxxxx"
                dir="ltr"
                className="text-right"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ التغييرات"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => (window.location.href = artistUrl(user.slug))}
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          شوف بورتفوليوك
        </Button>
      </div>
    </form>
  );
}

/* ================= Artworks tab ================= */
function ArtworkFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: ArtworkItem | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title || "");
      setPrice(editing ? String(editing.price) : "");
      setDescription(editing?.description || "");
      setImage(editing?.image || null);
      setReady(true);
    } else {
      setReady(false);
    }
  }, [open, editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(price);
    if (!title.trim()) {
      toast.error("اكتب اسم اللوحة");
      return;
    }
    if (price === "" || isNaN(priceNum) || priceNum < 0) {
      toast.error("اكتب سعر صحيح");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api(`/api/me/artworks/${editing.id}`, {
          method: "PUT",
          body: { title, price: priceNum, description, image },
        });
        toast.success("اتعدلت اللوحة");
      } else {
        await api("/api/me/artworks", {
          method: "POST",
          body: { title, price: priceNum, description, image },
        });
        toast.success("اتضافت اللوحة لبورتفوليوك");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto fan-scroll" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editing ? `تعديل: ${editing.title}` : "إضافة لوحة جديدة"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "عدّل بيانات اللوحة واحفظ."
              : "اكتب اسم اللوحة وسعرها ووصف بسيط، وارفع صورتها (اختياري)."}
          </DialogDescription>
        </DialogHeader>
        {ready ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aw-title">اسم اللوحة *</Label>
              <Input
                id="aw-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: حارة الغروب"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aw-price">السعر (جنيه) *</Label>
              <Input
                id="aw-price"
                required
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثال: 4500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aw-desc">وصف اللوحة</Label>
              <Textarea
                id="aw-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="الخامة، القياس، الفكرة..."
              />
            </div>
            <ImageUpload
              value={image}
              onChange={setImage}
              label="صورة اللوحة (اختياري)"
              maxDim={1400}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : editing ? (
                  "حفظ التعديلات"
                ) : (
                  "إضافة اللوحة"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ArtworksTab() {
  const [artworks, setArtworks] = useState<ArtworkItem[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ArtworkItem | null>(null);
  const [deleting, setDeleting] = useState<ArtworkItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(() => {
    api<{ artworks: ArtworkItem[] }>("/api/me/artworks")
      .then((d) => setArtworks(d.artworks))
      .catch(() => setArtworks([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/api/me/artworks/${deleting.id}`, { method: "DELETE" });
      toast.success("اتمسحت اللوحة");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function toggleSold(w: ArtworkItem) {
    try {
      await api(`/api/me/artworks/${w.id}`, {
        method: "PUT",
        body: { status: w.status === "SOLD" ? "AVAILABLE" : "SOLD" },
      });
      toast.success(w.status === "SOLD" ? "رجعت اللوحة متاحة" : "اتعلّمت اللوحة كباعة");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">
          لوحاتك{" "}
          {artworks ? (
            <span className="text-muted-foreground text-base">
              ({formatPrice(artworks.length)})
            </span>
          ) : null}
        </h2>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 ml-2" />
          أضف لوحة
        </Button>
      </div>

      {artworks === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="p-10 text-center space-y-3">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <p className="font-bold text-lg">لسه مفيش لوحات</p>
            <p className="text-sm text-muted-foreground">
              ابدأ ضيف أول لوحة في بورتفوليوك — اسمها وسعرها ووصف بسيط وصورتها.
            </p>
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 ml-2" />
              أضف أول لوحة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artworks.map((w) => (
            <Card
              key={w.id}
              className="border-border/70 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {w.image ? (
                   
                  <img
                    src={w.image}
                    alt={w.title}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <span className="absolute top-2.5 right-2.5 rounded-full bg-background/90 backdrop-blur px-2.5 py-0.5 text-xs font-bold text-primary">
                  {formatPrice(w.price)} جنيه
                </span>
                {(w._count?.inquiries || 0) > 0 ? (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                    <Inbox className="h-3 w-3" />
                    {formatPrice(w._count!.inquiries)}
                  </span>
                ) : null}
                {w.status === "SOLD" ? (
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-foreground/80 text-background px-2.5 py-0.5 text-xs font-bold">
                    تباعت
                  </span>
                ) : null}
              </div>
              <CardContent className="p-4 space-y-1">
                <h3 className="font-bold truncate">{w.title}</h3>
                {w.description ? (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {w.description}
                  </p>
                ) : null}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditing(w);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    title="معاينة صفحة اللوحة"
                    aria-label={`معاينة ${w.title}`}
                    onClick={() => navigate(`/artwork/${w.id}`)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    title={w.status === "SOLD" ? "رجّعها متاحة" : "علّمها كباعة"}
                    onClick={() => toggleSold(w)}
                  >
                    {w.status === "SOLD" ? (
                      <RotateCcw className="h-3.5 w-3.5" />
                    ) : (
                      <PackageCheck className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(w)}
                    aria-label={`حذف ${w.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ArtworkFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={load}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تحب تمسح «{deleting?.title}»؟</AlertDialogTitle>
            <AlertDialogDescription>
              اللوحة هتتمسح نهائيًا من بورتفوليوك — مش هتقدر ترجعها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleteBusy}>لا، خليها</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteBusy}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "أيوه، امسحها"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= Inquiries tab ================= */
function InquiriesTab() {
  const [inquiries, setInquiries] = useState<InquiryItem[] | null>(null);

  const load = useCallback(() => {
    api<{ inquiries: InquiryItem[]; unread: number }>("/api/me/inquiries")
      .then((d) => setInquiries(d.inquiries))
      .catch(() => setInquiries([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id: string) {
    try {
      await api(`/api/me/inquiries/${id}`, { method: "PUT" });
      load();
    } catch {
      toast.error("حصلت مشكلة");
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/me/inquiries/${id}`, { method: "DELETE" });
      toast.success("اتمسحت الرسالة");
      load();
    } catch {
      toast.error("حصلت مشكلة");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">الاستفسارات</h2>
        {inquiries ? (
          <Badge variant="secondary">
            {formatPrice(inquiries.filter((i) => !i.isRead).length)} جديد
          </Badge>
        ) : null}
      </div>

      {inquiries === null ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="p-10 text-center space-y-3">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <p className="font-bold text-lg">مفيش استفسارات لسه</p>
            <p className="text-sm text-muted-foreground">
              أول ما حد يبعتلك استفسار أو طلب شراء من بورتفوليوك، هيظهر هنا فورًا.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <Card
              key={inq.id}
              className={`border-border/70 ${
                !inq.isRead ? "border-primary/40 bg-accent/30" : ""
              }`}
            >
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center font-bold text-secondary-foreground shrink-0">
                    {inq.name?.[0] || "؟"}
                  </div>
                  <div className="flex-1 min-w-40">
                    <div className="font-bold flex items-center gap-2 flex-wrap">
                      {inq.name}
                      {!inq.isRead ? (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-label="جديد" />
                      ) : null}
                    </div>
                    <a
                      href={`tel:${inq.phone}`}
                      dir="ltr"
                      className="text-xs text-muted-foreground hover:text-primary transition inline-flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {inq.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="gap-1">
                      <MessageSquare className="h-3 w-3" />
                      استفسار
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(inq.createdAt)}
                    </span>
                  </div>
                </div>

                {inq.artwork ? (
                  <p className="text-sm font-bold text-accent-foreground bg-accent/70 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    بخصوص لوحة: {inq.artwork.title}
                  </p>
                ) : null}

                {inq.message ? (
                  <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line rounded-xl bg-muted/60 p-3">
                    {inq.message}
                  </p>
                ) : null}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={waLink(inq.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3.5 w-3.5 ml-1" />
                      رد واتساب
                    </a>
                  </Button>
                  {!inq.isRead ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markRead(inq.id)}
                    >
                      <Eye className="h-3.5 w-3.5 ml-1" />
                      تم الاطلاع
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive mr-auto"
                    onClick={() => remove(inq.id)}
                    aria-label="حذف الرسالة"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= Overview tab ================= */
function OverviewTab() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MeStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [fullLink, setFullLink] = useState("");

  useEffect(() => {
    api<{ stats: MeStats }>("/api/me/stats")
      .then((d) => setStats(d.stats))
      .catch(() => setStats(null));
  }, []);

  // اللينك الكامل بيتجمع بعد الماونت — آمن ضد hydration mismatch
  useEffect(() => {
    if (user?.slug) setFullLink(artistUrl(user.slug));
  }, [user?.slug]);

  async function copyLink() {
    if (!fullLink) return;
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      toast.success("اتنسخ اللينك");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("مش قادر أنسخ اللينك");
    }
  }

  const cards = [
    {
      icon: Eye,
      label: "مشاهدات بورتفوليوك",
      value: stats ? formatPrice(stats.views) : "—",
    },
    {
      icon: ImageIcon,
      label: "لوحاتك",
      value: stats ? formatPrice(stats.artworks) : "—",
    },
    {
      icon: ShoppingBag,
      label: "اللي تباعت",
      value: stats ? formatPrice(stats.soldCount) : "—",
    },
    {
      icon: Inbox,
      label: "استفسارات جديدة",
      value: stats ? formatPrice(stats.newInquiries) : "—",
      highlight: !!stats?.newInquiries,
    },
    {
      icon: Wallet,
      label: "مبيعات (جنيه)",
      value: stats ? formatPrice(stats.soldValue) : "—",
    },
  ];

  return (
    <div className="space-y-5">
      {/* لينك البورتفوليو */}
      <Card className="border-border/70 fan-paper">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Link2 className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">لينك بورتفوليوك</p>
                <p dir="ltr" className="font-bold text-left truncate">
                  {fullLink || user?.slug || "..."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyLink}>
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 ml-1 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 ml-1" />
                )}
                نسخ
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  user && (window.location.href = artistUrl(user.slug))
                }
              >
                <ExternalLink className="h-4 w-4 ml-1" />
                فتح صفحتك
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => (
          <Card
            key={c.label}
            className={`border-border/70 ${
              c.highlight ? "border-primary/50 bg-accent/40" : ""
            }`}
          >
            <CardContent className="p-4 text-center space-y-1">
              <c.icon
                className={`h-5 w-5 mx-auto ${
                  c.highlight ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats && (stats.newInquiries > 0 || stats.newPurchases > 0) ? (
        <div className="rounded-xl bg-accent text-accent-foreground px-4 py-3 text-sm font-bold flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          عندك {stats.newInquiries} استفسار و{stats.newPurchases} طلب شراء جديد —
          شوفهم في التبويبات تحت!
        </div>
      ) : null}
    </div>
  );
}

/* ================= Purchases tab ================= */
const PURCHASE_STATUS: Record<
  string,
  { label: string; className: string }
> = {
  NEW: {
    label: "جديد",
    className: "bg-primary text-primary-foreground",
  },
  CONTACTED: {
    label: "تم التواصل",
    className: "bg-chart-2/20 text-[#8a6a14]",
  },
  COMPLETED: {
    label: "تم البيع",
    className: "bg-green-600/15 text-green-700",
  },
  CANCELLED: {
    label: "ملغي",
    className: "bg-muted text-muted-foreground",
  },
};

function PurchasesTab() {
  const [purchases, setPurchases] = useState<PurchaseItem[] | null>(null);

  const load = useCallback(() => {
    api<{ purchases: PurchaseItem[] }>("/api/me/purchases")
      .then((d) => setPurchases(d.purchases))
      .catch(() => setPurchases([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    try {
      await api(`/api/me/purchases/${id}`, { method: "PATCH", body: { status } });
      toast.success("اتحدثت حالة الطلب");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">طلبات الشراء</h2>
        {purchases ? (
          <Badge variant="secondary">
            {formatPrice(purchases.filter((p) => p.status === "NEW").length)} جديد
          </Badge>
        ) : null}
      </div>

      {purchases === null ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="p-10 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <p className="font-bold text-lg">مفيش طلبات شراء لسه</p>
            <p className="text-sm text-muted-foreground">
              أي زائر يضغط «اشتري الآن» على لوحة من لوحاتك، طلبه هيظهر هنا فورًا
              ببياناته كاملة.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {purchases.map((p) => {
            const st = PURCHASE_STATUS[p.status] || PURCHASE_STATUS.NEW;
            return (
              <Card
                key={p.id}
                className={`border-border/70 ${
                  p.status === "NEW" ? "border-primary/40 bg-accent/30" : ""
                }`}
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center font-bold text-secondary-foreground shrink-0">
                      {p.buyerName?.[0] || "؟"}
                    </div>
                    <div className="flex-1 min-w-40">
                      <div className="font-bold flex items-center gap-2 flex-wrap">
                        {p.buyerName}
                        {p.status === "NEW" ? (
                          <span
                            className="h-2 w-2 rounded-full bg-primary animate-pulse"
                            aria-label="جديد"
                          />
                        ) : null}
                      </div>
                      <a
                        href={`tel:${p.buyerPhone}`}
                        dir="ltr"
                        className="text-xs text-muted-foreground hover:text-primary transition inline-flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {p.buyerPhone}
                      </a>
                    </div>
                    <Badge className={`${st.className} border-0`}>
                      {st.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>

                  {p.artwork ? (
                    <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-2.5">
                      {p.artwork.image ? (
                        <img
                          src={p.artwork.image}
                          alt={p.artwork.title}
                          className="h-12 w-12 rounded-lg object-cover border border-border"
                        />
                      ) : null}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {p.artwork.title}
                        </p>
                        <p className="text-xs text-primary font-bold">
                          {formatPrice(p.artwork.price)} جنيه
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {p.buyerCity || p.address ? (
                    <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <Globe className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      {[p.buyerCity, p.address].filter(Boolean).join(" — ")}
                    </p>
                  ) : null}

                  {p.note ? (
                    <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line rounded-xl bg-muted/60 p-3">
                      {p.note}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={waLink(p.buyerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-3.5 w-3.5 ml-1" />
                        كلّمه واتساب
                      </a>
                    </Button>
                    {p.status === "NEW" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(p.id, "CONTACTED")}
                      >
                        <Phone className="h-3.5 w-3.5 ml-1" />
                        تم التواصل
                      </Button>
                    ) : null}
                    {p.status !== "COMPLETED" && p.status !== "CANCELLED" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setStatus(p.id, "COMPLETED")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                          تم البيع
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setStatus(p.id, "CANCELLED")}
                        >
                          <Ban className="h-3.5 w-3.5 ml-1" />
                          إلغاء
                        </Button>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= Dashboard shell ================= */
/* ================= Suspended account notice ================= */
function SuspendedNotice({ user }: { user: PublicUser }) {
  const [appeals, setAppeals] = useState<AppealItem[] | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    api<{ appeals: AppealItem[] }>("/api/me/appeal")
      .then((d) => setAppeals(d.appeals))
      .catch(() => setAppeals([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pending = appeals?.find((a) => a.status === "PENDING") || null;
  const lastResolved =
    appeals?.find((a) => a.status !== "PENDING") || null;

  async function submitAppeal(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 10) {
      toast.error("اكتب سبب الطعن بشكل واضح (10 حروف على الأقل)");
      return;
    }
    setSending(true);
    try {
      await api("/api/me/appeal", {
        method: "POST",
        body: { message: message.trim() },
      });
      toast.success("اتبعت طلب الطعن للإدارة، هتوصلك رسالة لما يتراجع");
      setMessage("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card className="border-destructive/30">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
            <Ban className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="font-display text-2xl">
            حسابك موقوف حاليًا
          </CardTitle>
          <CardDescription>
            صفحتك مش ظاهرة للزوار دلوقتي، ومش هيقدروا يشوفوا لوحاتك أو
            يتواصلوا معاك من خلالها.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {user.suspendReason ? (
            <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 text-sm">
              <p className="font-semibold mb-1">سبب الحظر:</p>
              <p className="text-muted-foreground">{user.suspendReason}</p>
            </div>
          ) : null}

          {appeals === null ? (
            <Skeleton className="h-24 rounded-xl" />
          ) : pending ? (
            <div className="rounded-xl bg-accent/30 p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                طلب الطعن بتاعك قيد المراجعة
              </div>
              <p className="text-muted-foreground whitespace-pre-line">
                {pending.message}
              </p>
              <p className="text-xs text-muted-foreground">
                بعتّه في {formatDate(pending.createdAt)} — هيتراجع من الإدارة
                قريبًا.
              </p>
            </div>
          ) : (
            <form onSubmit={submitAppeal} className="space-y-3">
              {lastResolved?.status === "REJECTED" ? (
                <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 text-sm space-y-1">
                  <p className="font-semibold">آخر طعن اترفض</p>
                  {lastResolved.adminNote ? (
                    <p className="text-muted-foreground">
                      {lastResolved.adminNote}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <Label htmlFor="appeal-message">قدّم طلب طعن</Label>
              <Textarea
                id="appeal-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اشرح للإدارة ليه تعتقد إن حسابك المفروض يترجع نشط..."
              />
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Send className="h-4 w-4 ml-2" />
                )}
                إرسال الطعن للإدارة
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function Dashboard() {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    document.title = "لوحة التحكم | رسمة";
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <Skeleton className="h-16 w-72 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center space-y-4">
        <LogIn className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="text-xl font-bold">لازم تسجل دخول الأول</p>
        <p className="text-muted-foreground">
          لوحة التحكم متاحة للفنانين المسجلين بس.
        </p>
        <Button onClick={() => navigate("/login")}>سجل دخولك</Button>
      </div>
    );
  }

  if (user.role === "ADMIN") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center space-y-4">
        <p className="text-xl font-bold">إنت مسجل كأدمن</p>
        <Button onClick={() => navigate("/admin")}>لوحة الأدمن</Button>
      </div>
    );
  }

  if (user.status === "SUSPENDED") {
    return <SuspendedNotice user={user} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">
            أهلاً، {user.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            من هنا بتتحكم في بورتفوليوك ولوحاتك واستفساراتك
          </p>
        </div>
        <Button variant="outline" onClick={() => logout()}>
          <LogOut className="h-4 w-4 ml-2" />
          خروج
        </Button>
      </div>

      <Tabs defaultValue="overview" dir="rtl">
        <TabsList className="flex w-full flex-nowrap overflow-x-auto fan-scroll sm:grid sm:grid-cols-5 sm:max-w-2xl sm:overflow-visible h-auto p-1 gap-1">
          <TabsTrigger value="overview" className="gap-1.5 py-2.5 shrink-0">
            <LayoutDashboard className="h-4 w-4" />
            الرئيسية
          </TabsTrigger>
          <TabsTrigger value="artworks" className="gap-1.5 py-2.5 shrink-0">
            <ImageIcon className="h-4 w-4" />
            لوحاتي
          </TabsTrigger>
          <TabsTrigger value="purchases" className="gap-1.5 py-2.5 shrink-0">
            <ShoppingBag className="h-4 w-4" />
            طلبات الشراء
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="gap-1.5 py-2.5 shrink-0">
            <Inbox className="h-4 w-4" />
            الاستفسارات
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5 py-2.5 shrink-0">
            <UserRound className="h-4 w-4" />
            بياناتي
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="artworks" className="mt-6">
          <ArtworksTab />
        </TabsContent>
        <TabsContent value="purchases" className="mt-6">
          <PurchasesTab />
        </TabsContent>
        <TabsContent value="inquiries" className="mt-6">
          <InquiriesTab />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
