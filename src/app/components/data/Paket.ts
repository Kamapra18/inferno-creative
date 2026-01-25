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
    title: "Web Undangan Digital",
    subtitle: "Undangan Online Modern",
    price: "Rp 150.000",
    features: [
      "Subdomain (nama.web.com)",
      "Galeri Foto & Video",
      "Navigasi Google Maps",
      "Musik Backsound & RSVP",
      "Nama Tamu Unlimited",
      "Amplop Digital",
      "Upgrade Custom Domain (+150rb)",
    ],
    buttonText: "Pesan Web Saja",
  },
  {
    title: "Paket Foto & Video",
    subtitle: "Dokumentasi Lengkap Acara",
    price: "Rp 1.500.000",
    features: [
      "Sesi Foto Prewedding",
      "Dokumentasi Acara (8 Jam)",
      "Video Highlight Cinematic",
      "Edit Foto Profesional",
      "Pengiriman Via Flashdisk",
      "Gratis Web Undangan Standar",
      "Free Ganti Jadwal",
    ],
    buttonText: "Pesan Paket Favorit",
  },
  {
    title: "Paket Eksklusif",
    subtitle: "All-in-One: Foto, Video & Web",
    price: "Rp 2.000.000",
    originalPrice: "Rp 2.500.000",
    promo: true,
    features: [
      "Web Undangan Custom Domain",
      "Foto Prewed & Dokumentasi",
      "Video Cinematic & Drone",
      "Tim Profesional & Perlengkapan",
      "Galeri Lengkap Online",
      "Desain Eksklusif",
      "Unlimited Revisi Video",
      "Free Ganti Jadwal & Lokasi",
    ],
    buttonText: "Pesan Paket Eksklusif",
  },
];
