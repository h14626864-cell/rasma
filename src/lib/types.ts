export interface PublicUser {
  id: string;
  name: string;
  slug: string;
  phone: string;
  isGraduate: boolean;
  college: string;
  bio: string;
  journey: string;
  passion: string;
  photo: string | null;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  role: string;
  status?: string;
  suspendReason?: string;
  createdAt: string;
}

export interface ArtistListItem {
  id: string;
  name: string;
  slug: string;
  isGraduate: boolean;
  college: string;
  bio: string;
  photo: string | null;
  views?: number;
  createdAt: string;
  _count: { artworks: number };
}

export interface ArtistFull {
  id: string;
  name: string;
  slug: string;
  isGraduate: boolean;
  college: string;
  bio: string;
  journey: string;
  passion: string;
  photo: string | null;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  createdAt: string;
  views?: number;
  artworks: ArtworkItem[];
}

export interface ArtworkItem {
  id: string;
  artistId?: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
  status?: string; // AVAILABLE | SOLD
  featured?: boolean;
  createdAt: string;
  artist?: {
    id: string;
    name: string;
    slug: string;
    isGraduate?: boolean;
    college?: string;
  };
  _count?: { inquiries: number; purchases?: number };
}

export interface InquiryItem {
  id: string;
  artistId: string;
  artworkId: string | null;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  artwork?: { id: string; title: string } | null;
  artist?: { id?: string; name: string; slug?: string; phone?: string };
}

export interface PurchaseItem {
  id: string;
  artworkId: string;
  artistId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCity: string;
  address: string;
  note: string;
  status: "NEW" | "CONTACTED" | "COMPLETED" | "CANCELLED" | string;
  createdAt: string;
  artwork?: { id: string; title: string; price: number; image: string | null } | null;
  artist?: { id?: string; name: string; slug?: string; phone?: string };
}

export interface MeStats {
  artworks: number;
  soldCount: number;
  soldValue: number;
  availableValue: number;
  views: number;
  inquiries: number;
  newInquiries: number;
  purchases: number;
  newPurchases: number;
  slug: string;
  whatsappEnabled: boolean;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
}

export interface AdminStats {
  stats: {
    totalArtists: number;
    activeArtists: number;
    suspendedArtists: number;
    graduates: number;
    students: number;
    totalArtworks: number;
    soldArtworks: number;
    availableArtworks: number;
    featuredArtworks: number;
    catalogValue: number;
    soldValue: number;
    availableValue: number;
    totalViews: number;
    totalInquiries: number;
    unreadInquiries: number;
    totalPurchases: number;
    purchasesNew: number;
    purchasesContacted: number;
    purchasesCompleted: number;
    purchasesCancelled: number;
    completedValue: number;
  };
  signupSeries: { date: string; count: number }[];
  artworksByCollege: { name: string; count: number }[];
  topArtists: {
    id: string;
    name: string;
    slug: string;
    views: number;
    artworks: number;
    inquiries: number;
    purchases: number;
  }[];
  mostActive: {
    id: string;
    name: string;
    slug: string;
    artworks: number;
    inquiries: number;
    purchases: number;
  }[];
  recentArtists: {
    id: string;
    name: string;
    slug: string;
    college: string;
    isGraduate: boolean;
    photo: string | null;
    status: string;
    createdAt: string;
    _count: { artworks: number };
  }[];
  recentPurchases: PurchaseItem[];
  recentInquiries: InquiryItem[];
}

export interface AdminArtist {
  id: string;
  name: string;
  slug: string;
  phone: string;
  isGraduate: boolean;
  college: string;
  bio: string;
  photo: string | null;
  whatsappEnabled: boolean;
  status: string;
  suspendReason: string;
  views: number;
  createdAt: string;
  _count: { artworks: number; inquiries: number; purchases: number };
}

export interface AppealItem {
  id: string;
  artistId: string;
  message: string;
  status: string; // PENDING | APPROVED | REJECTED
  adminNote: string;
  createdAt: string;
  artist?: {
    id: string;
    name: string;
    slug: string;
    phone: string;
    status?: string;
    suspendReason?: string;
  };
}

export interface AdminArtwork {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
  status: string;
  featured: boolean;
  createdAt: string;
  artist: { id: string; name: string; slug: string };
  _count: { inquiries: number; purchases: number };
}
