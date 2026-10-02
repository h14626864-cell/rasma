import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ArtworkDetail } from "@/components/site/artwork-detail";

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
      createdAt: true,
      artist: {
        select: {
          id: true,
          name: true,
          slug: true,
          college: true,
          photo: true,
          status: true,
          whatsappEnabled: true,
          whatsappNumber: true,
        },
      },
    },
  });
  if (!artwork || artwork.artist.status !== "ACTIVE") return null;

  // لوحات تانية لنفس الفنان (أول 4 غير الحالية)
  const others = await db.artwork.findMany({
    where: { artistId: artwork.artist.id, id: { not: artwork.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: {
      id: true,
      title: true,
      price: true,
      image: true,
      status: true,
    },
  });

  return { artwork, others };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getArtwork(id);
  if (!data) return { title: "اللوحة مش موجودة | رسمة" };
  const { artwork } = data;
  return {
    title: `«${artwork.title}» — ${artwork.artist.name} | رسمة`,
    description:
      artwork.description?.slice(0, 150) ||
      `لوحة فنية بعنوان «${artwork.title}» للفنان ${artwork.artist.name} — ${artwork.price} جنيه على منصة رسمة.`,
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getArtwork(id);
  if (!data) notFound();

  return (
    <ArtworkDetail
      artwork={JSON.parse(JSON.stringify(data.artwork))}
      others={JSON.parse(JSON.stringify(data.others))}
    />
  );
}
