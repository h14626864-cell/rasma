import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BuyForm } from "@/components/site/buy-form";

export const dynamic = "force-dynamic";

async function getArtwork(id: string) {
  if (!/^[a-z0-9]{10,40}$/i.test(id)) return null;
  const artwork = await db.artwork.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      image: true,
      status: true,
      artist: {
        select: { id: true, name: true, slug: true, college: true, photo: true },
      },
    },
  });
  return artwork;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) return { title: "اللوحة مش موجودة" };
  return { title: `اشتري «${artwork.title}» — ${artwork.artist.name}` };
}

export default async function BuyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) notFound();

  return <BuyForm artwork={JSON.parse(JSON.stringify(artwork))} />;
}
