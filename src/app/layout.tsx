import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "رسمة | منصة خريجي كليات الفنون الجميلة",
  description:
    "اعمل بورتفوليو باسمك ولينك خاص بيك، اعرض لوحاتك، استقبل طلبات الشراء والتواصل من الجمهور — رسمة، منصة خريجي وطلاب كليات ومعاهد الفنون الجميلة.",
  keywords: [
    "رسمة",
    "rasma",
    "بورتفوليو",
    "فنون جميلة",
    "لوحات فنية",
    "فنانين مصريين",
    "بيع لوحات",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300..900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster richColors position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
