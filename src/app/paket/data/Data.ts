export interface Paket {
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  promo?: boolean;
  features: string[];
  buttonText: string;
}
export const paketList: Paket[] = [
  {
    title: "PAKET FOTO",
    subtitle: "Paket full layanan Foto 6 jam Kerja",
    price: "Rp300.000",
    originalPrice: "Rp450.000",
    promo: true,
    features: [
      "Fotografer Profesional (6 Jam)",
      "Unlimited Photoshoot",
      "Semua File Foto (Google Drive)",
      "Foto Yang Sudah Di Edit",
      "Link Dokumentasi Online",
    ],
    buttonText: "Ambil Promo Foto",
  },
  {
    title: "PAKET VIDEO",
    subtitle: "Paket full layanan Video 8 jam Kerja",
    price: "Rp1.200.000",
    originalPrice: "Rp1.500.000",
    promo: true,
    features: [
      "Videografer Profesional (8 Jam)",
      "Kualitas Video Full HD",
      "Background Music Bebas Pilih",
      "Revisi Video 1x",
    ],
    buttonText: "Ambil Promo Video",
  },
  {
    title: "PAKET FOTO DAN VIDEO",
    subtitle: "Paket full layanan Foto dan Video 8 jam Kerja",
    price: "Rp1.500.000",
    originalPrice: "Rp2.200.000",
    promo: true,
    features: [
      "Tim Foto & Video (8 Jam)",
      "Video Cinematic & Highlight Teaser",
      "Album Digital Eksklusif",
      "Foto Prewedding (Outdoor Bali)",
      "Bonus Undangan Web (Subdomain)",
      "Penyimpanan Cloud 1 Tahun",
    ],
    buttonText: "Booking Paket Hemat",
  },
  {
    title: "Web Undangan",
    subtitle: "Layanan Web Undangan biasa",
    price: "Rp150.000",
    originalPrice: "Rp200.000",
    promo: true,
    features: [
      "Galeri Foto 9",
      "galeri Video 1",
      "Navigasi Lokasi & Countdown",
      "RSVP & Manajemen Tamu",
      "Fitur Kirim Kado Digital",
      "Masa Aktif 1 Tahun",
    ],
    buttonText: "Pesan Web Premium",
  },
  {
    title: "Web Undangan (Custom Domain)",
    subtitle: "Layanan Web Undangan Premium & Personal",
    price: "Rp250.000",
    originalPrice: "Rp300.000",
    promo: true,
    features: [
      "Domain Custom (.com / .my.id)",
      "Galeri Foto & Video Unlimited",
      "Navigasi Lokasi & Countdown",
      "RSVP & Manajemen Tamu",
      "Fitur Kirim Kado Digital",
      "Masa Aktif 1 Tahun",
    ],
    buttonText: "Pesan Web Premium",
  },
];
