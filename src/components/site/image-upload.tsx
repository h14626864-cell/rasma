"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { compressImage } from "@/lib/compress";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
  hint?: string;
  maxDim?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "صورة (اختياري)",
  hint = "بنضغط الصورة تلقائيًا مع الحفاظ على جودتها قبل الرفع",
  maxDim = 900,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      const compressed = await compressImage(file, maxDim);
      onChange(compressed);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "حصلت مشكلة في الصورة");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <div className="flex items-start gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        {value ? (
          <div className="relative">
            { }
            <img
              src={value}
              alt="معاينة الصورة"
              className="h-24 w-24 rounded-xl object-cover border border-border fan-card-shadow"
            />
            <button
              type="button"
              aria-label="إزالة الصورة"
              onClick={() => onChange(null)}
              className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-destructive text-white grid place-items-center shadow hover:opacity-90 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="h-24 w-24 rounded-xl border-2 border-dashed border-input grid place-items-center text-muted-foreground hover:border-primary hover:text-primary transition bg-muted/40"
            aria-label="اختيار صورة"
          >
            {busy ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
          </button>
        )}
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "جاري الضغط..." : value ? "تغيير الصورة" : "اختر صورة"}
          </Button>
          <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
          {err ? <p className="text-xs text-destructive">{err}</p> : null}
        </div>
      </div>
    </div>
  );
}
