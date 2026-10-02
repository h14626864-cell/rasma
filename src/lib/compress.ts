"use client";

/**
 * Compresses an image file in the browser (canvas) before upload:
 * - scales down to maxDim on the longest side
 * - re-encodes as JPEG with descending quality until size target is met
 * Keeps visual quality high while drastically reducing size.
 */
export async function compressImage(
  file: File,
  maxDim = 900,
  quality = 0.75
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("الملف لازم يكون صورة");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("مش قادر أقرا الصورة"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("الصورة مش صالحة"));
    image.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("مشكلة في المتصفح");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  let out = canvas.toDataURL("image/jpeg", quality);
  let q = quality;
  // keep pushing down until ~250KB (base64) or quality floor
  while (out.length > 330_000 && q > 0.35) {
    q -= 0.08;
    out = canvas.toDataURL("image/jpeg", q);
  }
  return out;
}
