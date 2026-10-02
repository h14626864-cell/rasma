import { Ban } from "lucide-react";

export function ArtistSuspended({ name }: { name?: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <Ban className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="font-display text-2xl font-bold mb-2">
        تم وقف هذا الفنان
      </h1>
      <p className="text-muted-foreground">
        {name ? `صفحة ${name} ` : "الصفحة دي "}
        متوقفة حاليًا من إدارة المنصة وغير متاحة للزوار.
      </p>
    </div>
  );
}
