"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Loader2,
  LogIn,
  UserRoundPlus,
  Palette,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { api, navigate } from "@/lib/client";
import { PublicUser } from "@/lib/types";
import { useAuth } from "./auth";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";

function AuthRedirect() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center space-y-4">
      <p className="text-lg text-muted-foreground">
        إنت مسجل دخول بالفعل — تروح لوحة تحكمك؟
      </p>
      <Button onClick={() => navigate("/dashboard")}>لوحة تحكمي</Button>
    </div>
  );
}

export function RegisterPage() {
  const { user, loading, setUser } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [isGraduate, setIsGraduate] = useState("yes");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const slugPreview =
    slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") || "اسمك-هنا";
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    document.title = "انضم كفنان | رسمة";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await api<{ user: PublicUser }>("/api/auth/register", {
        method: "POST",
        body: {
          name,
          phone,
          password,
          slug,
          isGraduate: isGraduate === "yes",
          college,
          bio,
          photo,
        },
      });
      setUser(data.user);
      toast.success(`أهلاً بيك يا ${data.user.name} — بورتفوليوك جاهز`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && user) return <AuthRedirect />;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Card className="border-border/70 fan-card-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center mb-1">
            <Palette className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl font-bold">
            انضم كفنان
          </CardTitle>
          <CardDescription>
            اعمل بورتفوليوك المجاني في دقيقة — سجل بياناتك وهتقدر تعدلها في أي
            وقت من لوحة تحكمك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r-name">اسمك *</Label>
                <Input
                  id="r-name"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك الكامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-phone">رقم الموبايل *</Label>
                <Input
                  id="r-phone"
                  required
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-pass">كلمة السر *</Label>
              <Input
                id="r-pass"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 حروف على الأقل"
              />
            </div>

            <div className="space-y-2">
              <Label>إنت خريج ولا لسه طالب؟</Label>
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
                  <RadioGroupItem value="yes" id="grad-yes" />
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
                  <RadioGroupItem value="no" id="grad-no" />
                  <BookOpen className="h-5 w-5 text-chart-2" />
                  <span className="font-bold">طالب</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-slug">اسم البورتفوليو (اللينك الخاص بيك) *</Label>
              <Input
                id="r-slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="مثال: hamza"
                dir="ltr"
                className="text-left"
              />
              <div className="rounded-lg bg-accent/60 px-3 py-2 text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">لينكك هيبقى:</span>
                <span dir="ltr" className="font-bold text-foreground truncate">
                  {origin ? `${origin}/artist/${slugPreview}` : `/artist/${slugPreview}`}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                حروف إنجليزية صغيرة وأرقام بس — ده اللينك اللي هتبعته للناس يفتحوا بورتفوليوك مباشرة.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-college">الكلية أو المعهد</Label>
              <Input
                id="r-college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="مثال: كلية الفنون الجميلة – القاهرة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="r-bio">نبذة بسيطة عنك</Label>
              <Textarea
                id="r-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب عن أسلوبك الفني وتجاربك في سطرين تلاتة..."
              />
            </div>

            <Separator />

            <ImageUpload value={photo} onChange={setPhoto} label="صورتك الشخصية (اختياري)" maxDim={600} />

            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin ml-2" />
                  جاري إنشاء حسابك...
                </>
              ) : (
                <>
                  <UserRoundPlus className="h-5 w-5 ml-2" />
                  إنشاء الحساب
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              عندك حساب بالفعل؟{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary font-bold hover:underline"
              >
                سجل دخولك
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginPage() {
  const { user, loading, setUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await api<{ user: PublicUser }>("/api/auth/login", {
        method: "POST",
        body: { phone, password },
      });
      setUser(data.user);
      toast.success(`أهلاً بيك تاني يا ${data.user.name}`);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حصلت مشكلة");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && user) return <AuthRedirect />;

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <Card className="border-border/70 fan-card-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center mb-1">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl font-bold">
            تسجيل الدخول
          </CardTitle>
          <CardDescription>
            ادخل برقم موبايلك وكلمة السر اللي سجلت بيهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="l-phone">رقم الموبايل</Label>
              <Input
                id="l-phone"
                required
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="l-pass">كلمة السر</Label>
              <Input
                id="l-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة السر"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin ml-2" />
                  جاري الدخول...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 ml-2" />
                  دخول
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              أول مرة هنا؟{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary font-bold hover:underline"
              >
                انضم كفنان مجانًا
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
