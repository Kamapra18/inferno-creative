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
    title: "Paket Hemat",
    subtitle: "Web Undangan",
    price: "Rp. 150,000",
    originalPrice: "Rp 250,000",
    promo: true,
    features: [
      "1–3 Foto Utama",
      "Galeri Foto & Video",
      "Google Maps",
      "Musik Backsound",
      "Kolom Ucapan",
      "Hitung Mundur",
      "Nama Tamu Unlimited",
      "Amplop Digital",
      "Free Ganti Tanggal",
    ],
    buttonText: "Pesan Paket Hemat",
  },
  {
    title: "Paket Favorit",
    subtitle: "Foto & Video (Dokumentasi/Prewed)",
    price: "Rp. 850,000",
    originalPrice: "Rp 1,200,000",
    promo: true,
    features: [
      "Sesi Foto Prewedding",
      "Dokumentasi Acara",
      "Video Highlight",
      "Drone Shot (jika tersedia)",
      "Edit Foto Profesional",
      "Pengiriman Digital & Flashdisk",
      "Gratis Web Undangan Sederhana",
      "Free Ganti Jadwal",
    ],
    buttonText: "Pesan Paket Favorit",
  },
  {
    title: "Paket Eksklusif",
    subtitle: "Lengkap Foto, Video, dan Web Undangan",
    price: "Rp. 1,800,000",
    originalPrice: "Rp 2,500,000",
    promo: true,
    features: [
      "Web Undangan Premium",
      "Foto Prewed & Dokumentasi Acara",
      "Video Cinematic",
      "Drone & Tim Profesional",
      "Galeri Lengkap Online",
      "Undangan dengan Custom Domain",
      "Nama Tamu & Amplop Digital",
      "Desain Eksklusif & Unlimited Revisi",
      "Free Ganti Jadwal & Lokasi",
    ],
    buttonText: "Pesan Paket Eksklusif",
  },
];
