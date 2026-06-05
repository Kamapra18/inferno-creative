export interface Paket {
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  promo?: boolean;
  badge?: string;
  features: string[];
  buttonText: string;
  category: "undangan" | "dokumentasi" | "photobooth" | "all";
}

/* ========================= */
/* UNDANGAN (2 ITEM) */
/* ========================= */
export const paketUndangan: Paket[] = [
  {
    title: "Web Undangan Basic",
    subtitle: "Simple & Elegan",
    price: "Rp 200.000",
    category: "undangan",
    features: [
      "Template siap pakai",
      "Google Maps",
      "Nama Tamu Unlimited",
      "Galeri Foto (maks. 6 foto)",
      "Background Musik",
    ],
    buttonText: "Pesan Sekarang",
  },
  {
    title: "Web Undangan Standard",
    subtitle: "Interaktif & Lebih Lengkap",
    price: "Rp 300.000",
    // badge: "Paling Laris",
    category: "undangan",
    features: [
      "Galeri Foto & Video",
      "Google Maps",
      "Nama Tamu Unlimited",
      "RSVP & Amplop Digital",
      "Background Musik",
    ],
    buttonText: "Pesan Sekarang",
  },
  {
    title: "Web Undangan Premium",
    subtitle: "Custom & Eksklusif",
    price: "Rp 500.000",
    badge: "Custom",
    category: "undangan",
    features: [
      "Desain Custom Sesuai Request",
      "Custom Domain",
      "Galeri Foto & Video",
      "Google Maps",
      "RSVP & Amplop Digital",
      "Background Musik",
    ],
    buttonText: "Pesan Premium",
  },
  {
    title: "Desain Undangan",
    subtitle: "Custom desain undangan sesuai konsep acara",
    price: "Rp 50.000 - Rp 100.000",
    category: "undangan",
    features: [
      "Desain Custom Sesuai Tema",
      "Revisi Hingga 5x",
      "File Siap Cetak & Digital",
      "Konsultasi Konsep Gratis",
    ],
    buttonText: "Pesan Sekarang",
  },
  {
    title: "Undangan Cetak",
    subtitle: "Layanan cetak undangan berkualitas",
    price: "Rp 3.000 / pcs",
    badge: "Best Value",
    category: "undangan",
    features: [
      "Kertas Premium",
      "Hasil Cetak Tajam",
      "Minimal Order Fleksibel",
      "Bisa Sekalian Desain",
    ],
    buttonText: "Pesan Sekarang",
  },
  {
    title: "Paket Complit",
    subtitle: "Undangan Cetak dan Undangan Digital",
    price: "Rp 500.000",
    originalPrice: "Rp 650.000",
    promo: true,
    badge: "Favorit",
    category: "undangan",
    features: [
      "Free desain",
      "Free Revisi 3x",
      "Undangan Digital",
      "Undangan Cetak",
    ],
    buttonText: "Claim Sekarang",
  },
];

/* ========================= */
/* DOKUMENTASI (2 ITEM) */
/* ========================= */
export const paketDokumentasi: Paket[] = [
  {
    title: "Foto Graduation",
    subtitle: "Cocok untuk Wisuda & Personal",
    originalPrice: "Rp 499.000",
    price: "Rp 300.000",
    promo: true,
    badge: "Favorit Mahasiswa",
    category: "dokumentasi",
    features: [
      "Durasi 3 jam",
      "Free edit warna",
      "file dikirim via google drive",
      "Diskon Rp50.000 untuk setiap tambahan orang",
    ],
    buttonText: "Booking Graduation",
  },
  {
    title: "Paket Foto Event",
    subtitle: "Dokumentasi Acara Profesional",
    price: "Rp 350.000",
    category: "dokumentasi",
    features: [
      "Durasi 6 jam",
      "Edit warna profesional",
      "file dikirim via google drive",
      "Overtime +Rp50.000/jam",
      "Cocok untuk event & acara",
    ],
    buttonText: "Pesan Foto",
  },
  {
    title: "Foto + Video",
    subtitle: "Dokumentasi Lengkap & Cinematic",
    price: "Rp 1.500.000",
    // badge: "Best Seller",
    category: "dokumentasi",
    features: [
      "Durasi 8 jam",
      "Foto & video full coverage",
      "Highlight cinematic",
      "Drone (opsional)",
      "File via Google Drive",
    ],
    buttonText: "Pesan Paket",
  },
];

/* ========================= */
/* PHOTOBOOTH (3 ITEM) */
/* ========================= */
export const paketPhotobooth: Paket[] = [
  // {
  //   title: "Photobooth Free (Graduation)",
  //   subtitle: "Gratis Digital, Bayar Cetak",
  //   price: "Free",
  //   badge: "Free",
  //   category: "photobooth",
  //   features: [
  //     "Durasi 2 jam",
  //     "Free foto digital (scan QR)",
  //     "Bayar hanya jika cetak foto",
  //     "Properti standar",
  //     "Syarat follow Instagram Inferno Creative & Inferno Photobooth",
  //     // "Tidak berlaku untuk wedding",
  //   ],
  //   buttonText: "Claim Sekarang",
  // },

  {
    title: "Photobooth Digital",
    subtitle: "Photobooth seru tanpa cetak, praktis & hemat",
    price: "Rp 800.000",
    category: "photobooth",
    features: [
      "Durasi 5 jam",
      "Free foto digital (scan QR)",
      "Properti unik & lengkap",
      "Standby operator",
      "Tanpa cetak foto",
      "Add-on cetak tersedia (+biaya)",
      "Overtime +Rp100.000/jam",
    ],
    buttonText: "Pesan Paket",
  },
  {
    title: "Photobooth Wedding",
    subtitle: "Full Service Tanpa Ribet",
    price: "Rp 1.200.000",
    badge: "Favorit",
    category: "photobooth",
    features: [
      "Durasi 3 jam",
      "limited cetak foto (maks. 300 cetakan)",
      "Free foto digital (scan QR)",
      "Custom frame sesuai tema",
      "Properti unik & lengkap",
      "Standby operator",
      "Overtime +Rp100.000/jam",
    ],
    buttonText: "Pesan Sekarang",
  },
  {
    title: "Photobooth Wedding",
    subtitle: "Full Service Tanpa Ribet",
    price: "Rp 1.500.000",
    badge: "Best Value",
    category: "photobooth",
    features: [
      "Durasi 5 jam",
      "limited cetak foto (maks. 500 cetakan)",
      "Free foto digital (scan QR)",
      "Custom frame sesuai tema",
      "Properti unik & lengkap",
      "Standby operator",
      "Overtime +Rp100.000/jam",
    ],
    buttonText: "Pesan Sekarang",
  },
];

/* ========================= */
/* ALL IN ONE (3 ITEM - UNTUK HOMEPAGE) */
/* ========================= */
export const paketAllInOne: Paket[] = [
  {
    title: "Web Undangan Digital",
    subtitle: "Undangan Online Modern",
    price: "Rp 150.000",
    category: "all",
    badge: "Paling Hemat",
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
    category: "all",
    badge: "Paling Diminati",
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
    category: "all",
    badge: "Best Value",
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

/* ========================= */
/* GABUNGAN */
/* ========================= */
export const paketList: Paket[] = [
  ...paketUndangan,
  ...paketDokumentasi,
  ...paketPhotobooth,
  ...paketAllInOne,
];
