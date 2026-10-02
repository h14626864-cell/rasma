"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Image as ImageIcon,
  Wallet,
  Inbox,
  ShoppingBag,
  ShieldCheck,
  LogIn,
  Loader2,
  Eye,
  Star,
  Ban,
  RotateCcw,
  Trash2,
  Search,
  Download,
  Settings,
  TrendingUp,
  CheckCircle2,
  Phone,
  GraduationCap,
  BookOpen,
  KeyRound,
  Megaphone,
  UserX,
  UserCheck,
  ExternalLink,
  Gavel,
  CheckCheck,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { api, artistUrl, formatDate, formatPrice, navigate } from "@/lib/client";
import {
  AdminArtist,
  AdminArtwork,
  AdminStats,
  AppealItem,
  InquiryItem,
  PurchaseItem,
  SiteSettings,
} from "@/lib/types";
import { useAuth } from "./auth";
import { toast } from "sonner";

const CHART_COLORS = ["#bc5726", "#d9a441", "#7a8b5c", "#8b5e83", "#a4684b"];

function StatCard({
  icon: Icon,
  title,
  value,
  sub,
  tone = "primary",
}: {
  icon: typeof Users;
  title: string;
  value: string;
  sub?: string;
  tone?: "primary" | "gold" | "green" | "ink";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-chart-2/20 text-[#8a6a14]",
    green: "bg-chart-3/20 text-[#55663b]",
    ink: "bg-secondary text-secondary-foreground",
  };
  return (
    <Card className="border-border/70">
      <CardContent className="p-5 flex items-start gap-4">
        <div
          className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${tones[tone]}`}
        >
          <Icon className="h-5.5 w-5.5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          {sub ? (
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

const tooltipStyle = {
  fontFamily: "Cairo",
  borderRadius: 12,
  border: "1px solid #eae0cf",
  background: "#fffdf9",
  direction: "rtl" as const,
};

/* ================= Overview tab ================= */
function OverviewTab({ stats }: { stats: AdminStats | null }) {
  const s = stats?.stats;
  if (!stats || !s) return null;

  const funnel = [
    { name: "جديد", value: s.purchasesNew, color: "#bc5726" },
    { name: "تم التواصل", value: s.purchasesContacted, color: "#d9a441" },
    { name: "تم البيع", value: s.purchasesCompleted, color: "#7a8b5c" },
    { name: "ملغي", value: s.purchasesCancelled, color: "#b0a493" },
  ].filter((f) => f.value > 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Users}
          title="إجمالي الفنانين"
          value={formatPrice(s.totalArtists)}
          sub={`${formatPrice(s.activeArtists)} نشط • ${formatPrice(s.suspendedArtists)} موقوف`}
        />
        <StatCard
          icon={GraduationCap}
          title="خريجين / طلاب"
          value={`${formatPrice(s.graduates)} / ${formatPrice(s.students)}`}
          tone="gold"
        />
        <StatCard
          icon={ImageIcon}
          title="اللوحات"
          value={formatPrice(s.totalArtworks)}
          sub={`${formatPrice(s.availableArtworks)} متاحة • ${formatPrice(s.soldArtworks)} مباعة`}
          tone="gold"
        />
        <StatCard
          icon={Star}
          title="لوحات مميزة (الرئيسية)"
          value={formatPrice(s.featuredArtworks)}
          sub="من اختيار الإدارة"
        />
        <StatCard
          icon={Wallet}
          title="قيمة الكتالوج"
          value={`${formatPrice(s.catalogValue)} ج`}
          sub={`متاح للبيع: ${formatPrice(s.availableValue)} ج`}
          tone="green"
        />
        <StatCard
          icon={TrendingUp}
          title="قيمة المبيعات"
          value={`${formatPrice(s.soldValue)} ج`}
          sub={`مكتمل فعليًا: ${formatPrice(s.completedValue)} ج`}
          tone="green"
        />
        <StatCard
          icon={Inbox}
          title="الاستفسارات"
          value={formatPrice(s.totalInquiries)}
          sub={`${formatPrice(s.unreadInquiries)} لم تُقرأ بعد`}
          tone="ink"
        />
        <StatCard
          icon={ShoppingBag}
          title="طلبات الشراء"
          value={formatPrice(s.totalPurchases)}
          sub={`${formatPrice(s.purchasesNew)} في الانتظار`}
          tone="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">نمو التسجيلات — آخر 30 يوم</CardTitle>
            <CardDescription>عدد الفنانين اللي سجلوا كل يوم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.signupSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eae0cf" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#8a7c6a", fontSize: 11 }}
                    axisLine={{ stroke: "#eae0cf" }}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#8a7c6a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#bc5726"
                    strokeWidth={2.5}
                    dot={false}
                    name="تسجيلات"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">اللوحات حسب الكلية</CardTitle>
            <CardDescription>أكثر الكليات إنتاجًا على المنصة</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.artworksByCollege.length ? (
              <div className="h-64" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.artworksByCollege} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#eae0cf" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fill: "#8a7c6a", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={130}
                      tick={{ fill: "#5c4f3f", fontSize: 11, fontFamily: "Cairo" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="count"
                      fill="#d9a441"
                      radius={[0, 8, 8, 0]}
                      maxBarSize={22}
                      name="لوحات"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                لسه مفيش بيانات
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">حالة طلبات الشراء</CardTitle>
            <CardDescription>مين فين في رحلة البيع</CardDescription>
          </CardHeader>
          <CardContent>
            {funnel.length ? (
              <div className="h-56" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={funnel}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {funnel.map((f, i) => (
                        <Cell key={f.name} fill={f.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      formatter={(v) => (
                        <span style={{ fontFamily: "Cairo", fontSize: 12 }}>{v}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                لسه مفيش طلبات شراء
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top artists */}
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">الأكثر مشاهدة</CardTitle>
            <CardDescription>أعلى فنانين زيارات في بورتفوليوهاتهم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {stats.topArtists.length ? (
              stats.topArtists.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-bold shrink-0">
                    {formatPrice(i + 1)}
                  </span>
                  <span className="font-bold text-sm flex-1 truncate">
                    {a.name}
                  </span>
                  <Badge variant="secondary" className="gap-1 shrink-0">
                    <Eye className="h-3 w-3" />
                    {formatPrice(a.views)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6">—</p>
            )}
          </CardContent>
        </Card>

        {/* Most active */}
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-lg">الأكثر تفاعلًا</CardTitle>
            <CardDescription>لوحات + استفسارات + طلبات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {stats.mostActive.length ? (
              stats.mostActive.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-sm">
                  <span className="font-bold flex-1 truncate">{a.name}</span>
                  <Badge variant="outline" className="gap-0.5 shrink-0">
                    <ImageIcon className="h-3 w-3" />
                    {formatPrice(a.artworks)}
                  </Badge>
                  <Badge variant="outline" className="gap-0.5 shrink-0">
                    <Inbox className="h-3 w-3" />
                    {formatPrice(a.inquiries)}
                  </Badge>
                  <Badge variant="outline" className="gap-0.5 shrink-0">
                    <ShoppingBag className="h-3 w-3" />
                    {formatPrice(a.purchases)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border-border/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">آخر التسجيلات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentArtists.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                {a.photo ? (
                  <img
                    src={a.photo}
                    alt={a.name}
                    className="h-9 w-9 rounded-lg object-cover border border-border shrink-0"
                  />
                ) : (
                  <span className="h-9 w-9 rounded-lg bg-secondary grid place-items-center font-bold shrink-0">
                    {a.name?.[0]}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.college || "—"} • {formatDate(a.createdAt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => (window.location.href = artistUrl(a.slug))}
                  aria-label={`صفحة ${a.name}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {!stats.recentArtists.length ? (
              <p className="text-center text-muted-foreground py-4 text-sm">—</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">آخر النشاطات</CardTitle>
            <CardDescription>طلبات شراء واستفسارات وصلت للفنانين</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-72 overflow-y-auto fan-scroll">
            {stats.recentPurchases.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl bg-accent/40 px-3 py-2"
              >
                <ShoppingBag className="h-4 w-4 text-primary shrink-0" />
                <p className="text-sm flex-1 min-w-0 truncate">
                  <b>{p.buyerName}</b> طلب شراء «{p.artwork?.title}» من{" "}
                  {p.artist?.name}
                </p>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDate(p.createdAt)}
                </span>
              </div>
            ))}
            {stats.recentInquiries.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2"
              >
                <Inbox className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-sm flex-1 min-w-0 truncate">
                  <b>{q.name}</b> بعت استفسار{q.artwork ? ` عن «${q.artwork.title}»` : ""} لـ{" "}
                  {q.artist?.name}
                </p>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDate(q.createdAt)}
                </span>
              </div>
            ))}
            {!stats.recentPurchases.length && !stats.recentInquiries.length ? (
              <p className="text-center text-muted-foreground py-6 text-sm">
                لسه مفيش نشاط
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= Artists management ================= */
function AdminArtistsTab() {
  const [artists, setArtists] = useState<AdminArtist[] | null>(null);
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState<AdminArtist | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [suspending, setSuspending] = useState<AdminArtist | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendBusy, setSuspendBusy] = useState(false);

  const load = useCallback(() => {
    api<{ artists: AdminArtist[] }>("/api/admin/artists")
      .then((d) => setArtists(d.artists))
      .catch(() => setArtists([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // إعادة التنشيط مباشرة، أما الحظر فبيفتح نافذة لكتابة السبب
  async function toggleStatus(a: AdminArtist) {
    if (a.status === "ACTIVE") {
      setSuspendReason("");
      setSuspending(a);
      return;
    }
    try {
      await api(`/api/admin/artists/${a.id}`, {
        method: "PATCH",
        body: { status: "ACTIVE" },
      });
      toast.success("اتعاد تنشيط الفنان");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    }
  }

  async function confirmSuspend() {
    if (!suspending) return;
    if (!suspendReason.trim()) {
      toast.error("لازم تكتب سبب الحظر");
      return;
    }
    setSuspendBusy(true);
    try {
      await api(`/api/admin/artists/${suspending.id}`, {
        method: "PATCH",
        body: { status: "SUSPENDED", suspendReason: suspendReason.trim() },
      });
      toast.success("اتوقفت صفحة الفنان");
      setSuspending(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSuspendBusy(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/api/admin/artists/${deleting.id}`, { method: "DELETE" });
      toast.success(`اتمسح حساب ${deleting.name} وكل لوحاته`);
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setDeleteBusy(false);
    }
  }

  const filtered = (artists || []).filter(
    (a) =>
      !q.trim() ||
      a.name.includes(q) ||
      (a.college || "").includes(q) ||
      a.phone.includes(q) ||
      a.slug.includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث بالاسم، الرقم، الكلية، أو اسم البورتفوليو..."
          className="max-w-sm"
          aria-label="بحث في الفنانين"
        />
        <a href="/api/admin/export?type=artists" download>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير CSV
          </Button>
        </a>
      </div>

      <Card className="border-border/70">
        <CardContent className="p-0">
          {artists === null ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              {q ? "مفيش نتائج للبحث" : "لسه مفيش فنانين مسجلين"}
            </p>
          ) : (
            <div className="overflow-x-auto fan-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البورتفوليو</TableHead>
                    <TableHead>الموبايل</TableHead>
                    <TableHead>الكلية / المعهد</TableHead>
                    <TableHead>لوحات</TableHead>
                    <TableHead>استفسارات</TableHead>
                    <TableHead>مشاهدات</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} className={a.status === "SUSPENDED" ? "opacity-60" : ""}>
                      <TableCell className="font-bold whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {a.photo ? (
                            <img
                              src={a.photo}
                              alt=""
                              className="h-7 w-7 rounded-md object-cover"
                            />
                          ) : null}
                          {a.name}
                        </div>
                      </TableCell>
                      <TableCell dir="ltr" className="text-right whitespace-nowrap">
                        <a
                          href={artistUrl(a.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          {a.slug}
                        </a>
                      </TableCell>
                      <TableCell dir="ltr" className="text-right whitespace-nowrap">
                        {a.phone}
                      </TableCell>
                      <TableCell className="max-w-44 truncate">
                        {a.college || "—"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatPrice(a._count.artworks)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatPrice(a._count.inquiries)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatPrice(a.views)}
                      </TableCell>
                      <TableCell>
                        {a.status === "SUSPENDED" ? (
                          <div className="space-y-1">
                            <Badge className="bg-destructive/10 text-destructive border-0">
                              موقوف
                            </Badge>
                            {a.suspendReason ? (
                              <p
                                className="text-xs text-muted-foreground max-w-40 truncate"
                                title={a.suspendReason}
                              >
                                السبب: {a.suspendReason}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <Badge className="bg-chart-3/20 text-[#55663b] border-0">
                            نشط
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            title={a.status === "ACTIVE" ? "إيقاف الحساب" : "إعادة التنشيط"}
                            onClick={() => toggleStatus(a)}
                          >
                            {a.status === "ACTIVE" ? (
                              <UserX className="h-4 w-4 text-destructive" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-700" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="حذف الحساب نهائيًا"
                            onClick={() => setDeleting(a)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تحب تمسح حساب «{deleting?.name}»؟</AlertDialogTitle>
            <AlertDialogDescription>
              هيتمسح الفنان وكل لوحاته واستفساراته وطلباته نهائيًا — مش هتقدر
              ترجعها. لو عايز تجمّده بس، استخدم زرار الإيقاف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleteBusy}>إلغاء</AlertDialogCancel>
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
                "حذف نهائي"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!suspending}
        onOpenChange={(open) => {
          if (!open) setSuspending(null);
        }}
      >
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              وقف حساب «{suspending?.name}»
            </DialogTitle>
            <DialogDescription>
              صفحته هتختفي عن الزوار وتظهر بدالها رسالة إيقاف. اكتب سبب
              الحظر — هيتسجل مع الحساب.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">سبب الحظر *</Label>
            <Textarea
              id="suspend-reason"
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="مثال: مخالفة شروط الاستخدام، محتوى غير لائق..."
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSuspending(null)}
              disabled={suspendBusy}
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmSuspend}
              disabled={suspendBusy}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {suspendBusy ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Ban className="h-4 w-4 ml-2" />
              )}
              وقف الحساب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================= Artworks management ================= */
function AdminArtworksTab() {
  const [artworks, setArtworks] = useState<AdminArtwork[] | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleting, setDeleting] = useState<AdminArtwork | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (statusFilter) params.set("status", statusFilter);
    api<{ artworks: AdminArtwork[] }>(`/api/admin/artworks?${params}`)
      .then((d) => setArtworks(d.artworks))
      .catch(() => setArtworks([]));
  }, [q, statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  async function patch(id: string, body: Record<string, unknown>, msg: string) {
    try {
      await api(`/api/admin/artworks/${id}`, { method: "PATCH", body });
      toast.success(msg);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/api/admin/artworks/${deleting.id}`, { method: "DELETE" });
      toast.success("اتمسحت اللوحة");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث باللوحة أو الفنان..."
              className="pr-9 w-64"
              aria-label="بحث في اللوحات"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="فلتر الحالة"
          >
            <option value="">كل الحالات</option>
            <option value="AVAILABLE">متاحة</option>
            <option value="SOLD">مباعة</option>
          </select>
        </div>
        <a href="/api/admin/export?type=artworks" download>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير CSV
          </Button>
        </a>
      </div>

      <Card className="border-border/70">
        <CardContent className="p-0">
          {artworks === null ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              مفيش لوحات مطابقة
            </p>
          ) : (
            <div className="overflow-x-auto fan-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اللوحة</TableHead>
                    <TableHead>الفنان</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>مميزة</TableHead>
                    <TableHead>استفسارات</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artworks.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>
                        <div
                          className="flex items-center gap-2.5 min-w-40 cursor-pointer group/t"
                          onClick={() => navigate(`/artwork/${w.id}`)}
                          role="link"
                          aria-label={`صفحة لوحة ${w.title}`}
                        >
                          {w.image ? (
                            <img
                              src={w.image}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover border border-border"
                            />
                          ) : (
                            <span className="h-10 w-10 rounded-lg bg-muted grid place-items-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </span>
                          )}
                          <span className="font-bold truncate max-w-36 group-hover/t:text-primary transition-colors">
                            {w.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {w.artist?.name || "—"}
                      </TableCell>
                      <TableCell className="font-bold text-primary whitespace-nowrap">
                        {formatPrice(w.price)} ج
                      </TableCell>
                      <TableCell>
                        {w.status === "SOLD" ? (
                          <Badge className="bg-muted text-muted-foreground border-0">
                            مباعة
                          </Badge>
                        ) : (
                          <Badge className="bg-chart-3/20 text-[#55663b] border-0">
                            متاحة
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          title={w.featured ? "إزالة من الرئيسية" : "إظهار في الرئيسية"}
                          onClick={() =>
                            patch(
                              w.id,
                              { featured: !w.featured },
                              w.featured ? "اتشالت من الرئيسية" : "اتعرض في الرئيسية"
                            )
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${
                              w.featured
                                ? "fill-chart-2 text-chart-2"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatPrice(w._count.inquiries)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {formatDate(w.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            title={w.status === "SOLD" ? "رجوعها متاحة" : "علّمها مباعة"}
                            onClick={() =>
                              patch(
                                w.id,
                                { status: w.status === "SOLD" ? "AVAILABLE" : "SOLD" },
                                "اتحدثت حالة اللوحة"
                              )
                            }
                          >
                            {w.status === "SOLD" ? (
                              <RotateCcw className="h-4 w-4 text-green-700" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="حذف اللوحة"
                            onClick={() => setDeleting(w)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
              اللوحة هتتمسح نهائيًا من المنصة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleteBusy}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteBusy}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= Purchases management ================= */
const PURCHASE_STATUS_LABEL: Record<string, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  COMPLETED: "تم البيع",
  CANCELLED: "ملغي",
};

function AdminPurchasesTab() {
  const [purchases, setPurchases] = useState<PurchaseItem[] | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(() => {
    api<{ purchases: PurchaseItem[] }>("/api/admin/purchases")
      .then((d) => setPurchases(d.purchases))
      .catch(() => setPurchases([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    try {
      await api(`/api/admin/purchases/${id}`, { method: "PATCH", body: { status } });
      toast.success("اتحدثت الحالة");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    }
  }

  async function remove(id: string) {
    try {
      await api(`/api/admin/purchases/${id}`, { method: "DELETE" });
      toast.success("اتمسح الطلب");
      load();
    } catch {
      toast.error("حصلت مشكلة");
    }
  }

  const filtered = (purchases || []).filter(
    (p) => !statusFilter || p.status === statusFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          aria-label="فلتر حالة الطلب"
        >
          <option value="">كل الحالات</option>
          <option value="NEW">جديد</option>
          <option value="CONTACTED">تم التواصل</option>
          <option value="COMPLETED">تم البيع</option>
          <option value="CANCELLED">ملغي</option>
        </select>
        <a href="/api/admin/export?type=purchases" download>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير CSV
          </Button>
        </a>
      </div>

      <Card className="border-border/70">
        <CardContent className="p-0">
          {purchases === null ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              مفيش طلبات شراء
            </p>
          ) : (
            <div className="overflow-x-auto fan-scroll max-h-[560px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>المشتري</TableHead>
                    <TableHead>الموبايل</TableHead>
                    <TableHead>اللوحة</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الفنان</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-center">تغيير الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold whitespace-nowrap">
                        {p.buyerName}
                      </TableCell>
                      <TableCell dir="ltr" className="text-right whitespace-nowrap">
                        <a href={`tel:${p.buyerPhone}`} className="hover:text-primary">
                          {p.buyerPhone}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-36 truncate">
                        {p.artwork?.title || "—"}
                      </TableCell>
                      <TableCell className="font-bold text-primary whitespace-nowrap">
                        {p.artwork ? `${formatPrice(p.artwork.price)} ج` : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {p.artist?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            p.status === "NEW"
                              ? "bg-primary text-primary-foreground border-0"
                              : p.status === "COMPLETED"
                                ? "bg-chart-3/20 text-[#55663b] border-0"
                                : "bg-muted text-muted-foreground border-0"
                          }
                        >
                          {PURCHASE_STATUS_LABEL[p.status] || p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {p.status !== "CONTACTED" && p.status !== "COMPLETED" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              title="تم التواصل"
                              onClick={() => setStatus(p.id, "CONTACTED")}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          ) : null}
                          {p.status !== "COMPLETED" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              title="تم البيع"
                              onClick={() => setStatus(p.id, "COMPLETED")}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-700" />
                            </Button>
                          ) : null}
                          {p.status !== "CANCELLED" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              title="إلغاء"
                              onClick={() => setStatus(p.id, "CANCELLED")}
                            >
                              <Ban className="h-4 w-4 text-destructive" />
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="ghost"
                            title="حذف الطلب"
                            onClick={() => remove(p.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= Inquiries management ================= */
function AdminInquiriesTab() {
  const [inquiries, setInquiries] = useState<InquiryItem[] | null>(null);

  const load = useCallback(() => {
    api<{ inquiries: InquiryItem[] }>("/api/admin/inquiries")
      .then((d) => setInquiries(d.inquiries))
      .catch(() => setInquiries([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    <Card className="border-border/70">
      <CardContent className="p-0">
        {inquiries === null ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            لسه مفيش استفسارات
          </p>
        ) : (
          <div className="overflow-x-auto fan-scroll max-h-[560px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>المرسل</TableHead>
                  <TableHead>الموبايل</TableHead>
                  <TableHead>الفنان</TableHead>
                  <TableHead>اللوحة</TableHead>
                  <TableHead>الرسالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inq) => (
                  <TableRow key={inq.id} className={!inq.isRead ? "bg-accent/20" : ""}>
                    <TableCell className="font-bold whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        {inq.name}
                        {!inq.isRead ? (
                          <span
                            className="h-2 w-2 rounded-full bg-primary animate-pulse"
                            aria-label="جديد"
                          />
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell dir="ltr" className="text-right whitespace-nowrap">
                      {inq.phone}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {inq.artist?.name || "—"}
                    </TableCell>
                    <TableCell className="max-w-32 truncate">
                      {inq.artwork?.title || "—"}
                    </TableCell>
                    <TableCell className="max-w-56 truncate text-muted-foreground">
                      {inq.message || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                      {formatDate(inq.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="حذف"
                          onClick={() => remove(inq.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ================= Appeals management ================= */
function AdminAppealsTab() {
  const [appeals, setAppeals] = useState<AppealItem[] | null>(null);
  const [acting, setActing] = useState<{
    appeal: AppealItem;
    action: "APPROVE" | "REJECT";
  } | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<{ appeals: AppealItem[] }>("/api/admin/appeals")
      .then((d) => setAppeals(d.appeals))
      .catch(() => setAppeals([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAction(appeal: AppealItem, action: "APPROVE" | "REJECT") {
    setAdminNote("");
    setActing({ appeal, action });
  }

  async function confirmAction() {
    if (!acting) return;
    setBusy(true);
    try {
      await api(`/api/admin/appeals/${acting.appeal.id}`, {
        method: "PATCH",
        body: { action: acting.action, adminNote },
      });
      toast.success(
        acting.action === "APPROVE"
          ? "اتقبل الطعن واتعاد تنشيط الفنان"
          : "اترفض الطعن"
      );
      setActing(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setBusy(false);
    }
  }

  const pending = (appeals || []).filter((a) => a.status === "PENDING");
  const resolved = (appeals || []).filter((a) => a.status !== "PENDING");

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "قيد المراجعة",
    APPROVED: "اتقبل",
    REJECTED: "اترفض",
  };

  function AppealCard({ a }: { a: AppealItem }) {
    return (
      <Card className="border-border/70">
        <CardContent className="p-5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-bold">{a.artist?.name || "فنان محذوف"}</p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                {a.artist?.phone}
              </p>
            </div>
            <Badge
              className={
                a.status === "PENDING"
                  ? "bg-primary/10 text-primary border-0"
                  : a.status === "APPROVED"
                  ? "bg-chart-3/20 text-[#55663b] border-0"
                  : "bg-destructive/10 text-destructive border-0"
              }
            >
              {STATUS_LABEL[a.status] || a.status}
            </Badge>
          </div>

          {a.artist?.suspendReason ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">سبب الحظر الأصلي:</span>{" "}
              {a.artist.suspendReason}
            </p>
          ) : null}

          <div className="rounded-xl bg-accent/30 p-3 text-sm">
            <p className="font-semibold mb-1 text-xs text-muted-foreground">
              كلام الفنان في الطعن:
            </p>
            {a.message}
          </div>

          {a.adminNote ? (
            <div className="rounded-xl bg-secondary/40 p-3 text-sm">
              <p className="font-semibold mb-1 text-xs text-muted-foreground">
                رد الإدارة:
              </p>
              {a.adminNote}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">
            {formatDate(a.createdAt)}
          </p>

          {a.status === "PENDING" ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => openAction(a, "APPROVE")}
                className="bg-chart-3 hover:bg-chart-3/90 text-[#2c3620]"
              >
                <CheckCheck className="h-4 w-4 ml-2" />
                قبول الطعن وإعادة التنشيط
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAction(a, "REJECT")}
              >
                <XCircle className="h-4 w-4 ml-2 text-destructive" />
                رفض الطعن
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {appeals === null ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : !appeals.length ? (
        <p className="text-center text-muted-foreground py-10">
          لسه مفيش طعون مقدمة
        </p>
      ) : (
        <>
          {pending.length ? (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-muted-foreground">
                قيد المراجعة ({pending.length})
              </h3>
              {pending.map((a) => (
                <AppealCard key={a.id} a={a} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              مفيش طعون قيد المراجعة دلوقتي
            </p>
          )}

          {resolved.length ? (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-muted-foreground">
                طعون اتحسمت ({resolved.length})
              </h3>
              {resolved.map((a) => (
                <AppealCard key={a.id} a={a} />
              ))}
            </div>
          ) : null}
        </>
      )}

      <Dialog
        open={!!acting}
        onOpenChange={(open) => {
          if (!open) setActing(null);
        }}
      >
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {acting?.action === "APPROVE"
                ? "قبول الطعن وإعادة تنشيط الحساب"
                : "رفض الطعن"}
            </DialogTitle>
            <DialogDescription>
              {acting?.action === "APPROVE"
                ? "هيترجع حساب الفنان نشط فورًا وتتمسح صفحة الوقف من بورتفوليوه."
                : "الحساب هيفضل موقوف. تقدر (اختياري) تكتب سبب الرفض عشان يظهر للفنان."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="admin-note">ملاحظة للفنان (اختياري)</Label>
            <Textarea
              id="admin-note"
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="اكتب ردك هنا..."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActing(null)}
              disabled={busy}
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmAction}
              disabled={busy}
              className={
                acting?.action === "REJECT"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : ""
              }
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : acting?.action === "APPROVE" ? (
                <CheckCheck className="h-4 w-4 ml-2" />
              ) : (
                <XCircle className="h-4 w-4 ml-2" />
              )}
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================= Settings tab ================= */
function AdminSettingsTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passBusy, setPassBusy] = useState(false);

  useEffect(() => {
    api<{ settings: SiteSettings }>("/api/admin/settings")
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await api("/api/admin/settings", { method: "PUT", body: settings });
      toast.success("اتحفظت إعدادات الموقع");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassBusy(true);
    try {
      await api("/api/admin/me", {
        method: "PUT",
        body: { currentPassword, newPassword },
      });
      toast.success("اتغيرت كلمة السر");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setPassBusy(false);
    }
  }

  if (!settings) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-primary" />
            إعدادات الموقع
          </CardTitle>
          <CardDescription>
            النصوص دي بتظهر في الصفحة الرئيسية للمنصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveSettings} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="s-name">اسم الموقع</Label>
                <Input
                  id="s-name"
                  required
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-tagline">الوصف الجانبي</Label>
                <Input
                  id="s-tagline"
                  value={settings.tagline}
                  onChange={(e) =>
                    setSettings({ ...settings, tagline: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-hero">العنوان الرئيسي</Label>
              <Input
                id="s-hero"
                value={settings.heroTitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-sub">الوصف تحت العنوان</Label>
              <Input
                id="s-sub"
                value={settings.heroSubtitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroSubtitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-announce">شريط إعلان (اختياري)</Label>
              <Input
                id="s-announce"
                value={settings.announcement}
                onChange={(e) =>
                  setSettings({ ...settings, announcement: e.target.value })
                }
                placeholder="مثال: معرض الخريجين يبدأ يوم 15 من الشهر الجاي"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Megaphone className="h-3 w-3" />
                لو سايبه فاضي، مش هيظهر أي إعلان
              </p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الإعدادات"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5 text-primary" />
            تغيير كلمة سر الأدمن
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="s-cur">كلمة السر الحالية</Label>
                <Input
                  id="s-cur"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-new">كلمة السر الجديدة</Label>
                <Input
                  id="s-new"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" variant="outline" disabled={passBusy}>
              {passBusy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري التغيير...
                </>
              ) : (
                "تغيير كلمة السر"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= Admin shell ================= */
export function AdminPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    document.title = "لوحة الأدمن | رسمة";
  }, []);

  const loadStats = useCallback(() => {
    api<AdminStats>("/api/admin/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (loading || !user || user.role !== "ADMIN") return;
    loadStats();
  }, [user, loading, loadStats]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <Skeleton className="h-16 w-72 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center space-y-4">
        <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="text-xl font-bold">الصفحة دي للأدمن بس</p>
        <p className="text-muted-foreground">
          سجل دخول بحساب إدارة المنصة للوصول للإحصائيات.
        </p>
        <Button onClick={() => navigate("/login")}>
          <LogIn className="h-4 w-4 ml-2" />
          دخول
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            لوحة إدارة رسمة
          </h1>
          <p className="text-muted-foreground mt-1">
            تحكم كامل في المنصة — فنانين، لوحات، مبيعات، استفسارات، وإعدادات
          </p>
        </div>
        <Button variant="outline" onClick={loadStats} size="sm">
          <RotateCcw className="h-4 w-4 ml-2" />
          تحديث البيانات
        </Button>
      </div>

      <Tabs defaultValue="overview" dir="rtl">
        <TabsList className="flex w-full flex-nowrap overflow-x-auto fan-scroll sm:grid sm:grid-cols-7 sm:max-w-4xl sm:overflow-visible h-auto p-1 gap-1">
          <TabsTrigger value="overview" className="gap-1.5 py-2.5 shrink-0">
            <TrendingUp className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="artists" className="gap-1.5 py-2.5 shrink-0">
            <Users className="h-4 w-4" />
            الفنانون
          </TabsTrigger>
          <TabsTrigger value="artworks" className="gap-1.5 py-2.5 shrink-0">
            <ImageIcon className="h-4 w-4" />
            اللوحات
          </TabsTrigger>
          <TabsTrigger value="purchases" className="gap-1.5 py-2.5 shrink-0">
            <ShoppingBag className="h-4 w-4" />
            طلبات الشراء
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="gap-1.5 py-2.5 shrink-0">
            <Inbox className="h-4 w-4" />
            الاستفسارات
          </TabsTrigger>
          <TabsTrigger value="appeals" className="gap-1.5 py-2.5 shrink-0">
            <Gavel className="h-4 w-4" />
            الطعون
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5 py-2.5 shrink-0">
            <Settings className="h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab stats={stats} />
        </TabsContent>
        <TabsContent value="artists" className="mt-6">
          <AdminArtistsTab />
        </TabsContent>
        <TabsContent value="artworks" className="mt-6">
          <AdminArtworksTab />
        </TabsContent>
        <TabsContent value="purchases" className="mt-6">
          <AdminPurchasesTab />
        </TabsContent>
        <TabsContent value="inquiries" className="mt-6">
          <AdminInquiriesTab />
        </TabsContent>
        <TabsContent value="appeals" className="mt-6">
          <AdminAppealsTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <AdminSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
