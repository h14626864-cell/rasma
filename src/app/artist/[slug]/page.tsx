import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ArtistPortfolio } from "@/components/site/artist-portfolio";
import { ArtistSuspended } from "@/components/site/artist-suspended";

export const dynamic = "force-dynamic";

async function getArtist(slug: string) {
  const artist = await db.user.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      isGraduate: true,
      college: true,
      bio: true,
      journey: true,
      passion: true,
      photo: true,
      whatsappEnabled: true,
      whatsappNumber: true,
      status: true,
      views: true,
      createdAt: true,
      artworks: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          image: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });
  return artist;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) return { title: "الصفحة مش موجودة" };
  return {
    title: `${artist.name} — لوحات فنية`,
    description:
      artist.bio?.slice(0, 150) ||
      `أعمال الفنان ${artist.name}${artist.college ? ` — ${artist.college}` : ""}`,
  };
}

export default async function ArtistPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) notFound();
  if (artist.status !== "ACTIVE") {
    return <ArtistSuspended name={artist.name} />;
  }

  return <ArtistPortfolio artist={JSON.parse(JSON.stringify(artist))} />;
}
