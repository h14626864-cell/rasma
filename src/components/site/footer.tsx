"use client";

import { Palette } from "lucide-react";
import { navigate } from "@/lib/client";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            aria-label="الصفحة الرئيسية"
          >
            <span className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Palette className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg font-bold">رسمة</span>
          </button>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            منصة لخريجي وطلاب كليات ومعاهد الفنون الجميلة — بورتفوليو باسمك،
            ولينك ليك وحدك.
          </p>
        </div>
        <div className="mt-6 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} رسمة — صُنعت بحب للفنانين
        </div>
      </div>
    </footer>
  );
}
