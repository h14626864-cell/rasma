"use client";

import { useState } from "react";
import {
  Palette,
  Menu,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserRoundPlus,
  Images,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { artistUrl, navigate } from "@/lib/client";
import { useAuth } from "./auth";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/artists", label: "الفنانين", icon: Users },
  { href: "/artworks", label: "اللوحات", icon: Images },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function go(href: string) {
    setMenuOpen(false);
    navigate(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          onClick={() => go("/")}
          className="flex items-center gap-2.5 shrink-0"
          aria-label="الصفحة الرئيسية"
        >
          <span className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center fan-card-shadow">
            <Palette className="h-5 w-5" />
          </span>
          <span className="text-right leading-tight">
            <span className="font-display block text-xl font-bold text-foreground">
              رسمة
            </span>
            <span className="hidden sm:block text-[11px] text-muted-foreground">
              منصة خريجي الفنون الجميلة
            </span>
          </span>
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((l) => (
            <Button
              key={l.href}
              variant="ghost"
              onClick={() => go(l.href)}
              className="text-[15px]"
            >
              {l.label}
            </Button>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.role === "ADMIN" ? (
                <Button onClick={() => go("/admin")} className="hidden sm:inline-flex">
                  <ShieldCheck className="h-4 w-4 ml-2" />
                  لوحة الأدمن
                </Button>
              ) : (
                <Button onClick={() => go("/dashboard")} className="hidden sm:inline-flex">
                  <LayoutDashboard className="h-4 w-4 ml-2" />
                  لوحة تحكمي
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full outline-none ring-primary focus-visible:ring-2 transition"
                    aria-label="قائمة الحساب"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      {user.photo ? (
                        <AvatarImage src={user.photo} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                        {user.name?.trim()?.[0] || "ر"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-xs text-muted-foreground font-normal" dir="ltr">
                      {user.phone}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "ADMIN" ? (
                    <DropdownMenuItem onClick={() => go("/admin")}>
                      <ShieldCheck className="ml-2 h-4 w-4" />
                      لوحة الأدمن
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => go("/dashboard")}>
                        <LayoutDashboard className="ml-2 h-4 w-4" />
                        لوحة التحكم
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          user.slug
                            ? (window.location.href = artistUrl(user.slug))
                            : go("/dashboard")
                        }
                      >
                        <Palette className="ml-2 h-4 w-4" />
                        بورتفوليوك
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" onClick={() => go("/login")}>
                دخول
              </Button>
              <Button onClick={() => go("/register")}>
                <UserRoundPlus className="h-4 w-4 ml-2" />
                انضم كفنان
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="القائمة"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">رسمة</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((l) => (
                  <Button
                    key={l.href}
                    variant="ghost"
                    className="justify-start text-base"
                    onClick={() => go(l.href)}
                  >
                    {l.icon ? <l.icon className="ml-2 h-4 w-4" /> : null}
                    {l.label}
                  </Button>
                ))}
                <div className="my-2 h-px bg-border" />
                {user ? (
                  <>
                    {user.role === "ADMIN" ? (
                      <Button variant="ghost" className="justify-start" onClick={() => go("/admin")}>
                        <ShieldCheck className="ml-2 h-4 w-4" />
                        لوحة الأدمن
                      </Button>
                    ) : (
                      <Button variant="ghost" className="justify-start" onClick={() => go("/dashboard")}>
                        <LayoutDashboard className="ml-2 h-4 w-4" />
                        لوحة تحكمي
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start text-destructive"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="ml-2 h-4 w-4" />
                      تسجيل خروج
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => go("/login")}>
                      دخول
                    </Button>
                    <Button className="justify-start" onClick={() => go("/register")}>
                      <UserRoundPlus className="ml-2 h-4 w-4" />
                      انضم كفنان
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
