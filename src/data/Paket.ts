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
    title: "Undangan Online Premium",
    subtitle: "Interaktif & Lebih Lengkap",
    price: "Rp 300.000",
    category: "undangan",
    features: [
      "Galeri Foto & Video",
      "Google Maps",
      "Nama Tamu Unlimited",
      "RSVP & Amplop Digital",
      "Background Musik",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Undangan Online Eksklusif",
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
    buttonText: "Booking Now",
  },
];

/* ========================= */
/* DOKUMENTASI (2 ITEM) */
/* ========================= */
export const paketDokumentasi: Paket[] = [
  {
    title: "Prewedding Foto",
    subtitle: "Dokumentasi Prewedding (Foto Saja)",
    price: "Rp 1.500.000",
    category: "dokumentasi",
    features: [
      "Sesi Foto Prewedding",
      "Edit Foto Profesional",
      "File via Google Drive",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Prewedding Video",
    subtitle: "Dokumentasi Prewedding (Video Saja)",
    price: "Rp 1.500.000",
    category: "dokumentasi",
    features: [
      "Sesi Video Prewedding",
      "Video Cinematic",
      "File via Google Drive",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Prewedding Foto & Video",
    subtitle: "Dokumentasi Lengkap & Cinematic",
    price: "Rp 3.000.000",
    category: "dokumentasi",
    badge: "Best Value",
    features: [
      "Sesi Foto & Video Prewedding",
      "Highlight cinematic",
      "Edit Foto Profesional",
      "File via Google Drive",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Dokumentasi Wedding",
    subtitle: "Dokumentasi Pernikahan",
    price: "Rp 1.500.000",
    category: "dokumentasi",
    features: [
      "Dokumentasi Acara",
      "File via Google Drive",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Dokumentasi Event",
    subtitle: "Dokumentasi Acara Profesional",
    price: "Rp 1.500.000",
    category: "dokumentasi",
    features: [
      "Event Gathering",
      "Profil Desa",
      "Ulang Tahun / Acara Keluarga",
      "File via Google Drive",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Foto Graduation",
    subtitle: "Cocok untuk Wisuda & Personal",
    price: "Rp 500.000",
    badge: "Favorit Mahasiswa",
    category: "dokumentasi",
    features: [
      "Durasi 2 jam",
      "Free edit warna",
      "File dikirim via Google Drive",
    ],
    buttonText: "Booking Now",
  },
];

/* ========================= */
/* PHOTOBOOTH (3 ITEM) */
/* ========================= */
export const paketPhotobooth: Paket[] = [
  {
    title: "Photobooth Softcopy Only",
    subtitle: "Photobooth Digital Tanpa Cetak",
    price: "Start from Rp 800.000",
    category: "photobooth",
    features: [
      "2 Jam (Rp 800rb), 3 Jam (Rp 1,1jt)",
      "4 Jam (Rp 1,4jt), 5 Jam (Rp 1,8jt)",
      "Standby operator",
      "Properti standar",
      "Akses foto digital",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Photobooth Limited Print",
    subtitle: "Paket Cetak Terbatas",
    price: "Start from Rp 1.200.000",
    badge: "Favorit",
    category: "photobooth",
    features: [
      "2 Jam 100 Print (Rp 1,2jt)",
      "3 Jam 200 Print (Rp 1,5jt)",
      "4 Jam 300 Print (Rp 1,8jt)",
      "5 Jam 400 Print (Rp 2,2jt)",
      "Custom Frame & Properti",
    ],
    buttonText: "Booking Now",
  },
  {
    title: "Photobooth Unlimited Print",
    subtitle: "Full Service Tanpa Ribet",
    price: "Start from Rp 1.500.000",
    badge: "Best Value",
    category: "photobooth",
    features: [
      "2 Jam Unlimited (Rp 1,5jt)",
      "3 Jam Unlimited (Rp 1,8jt)",
      "4 Jam Unlimited (Rp 2,2jt)",
      "5 Jam Unlimited (Rp 2,5jt)",
      "Custom Frame & Properti",
    ],
    buttonText: "Booking Now",
  },
];



/* ========================= */
/* GABUNGAN */
/* ========================= */
const allPaket = [
  ...paketUndangan,
  ...paketDokumentasi,
  ...paketPhotobooth,
];

const topTitles = [
  "Prewedding Foto & Video",
  "Photobooth Unlimited Print",
  "Dokumentasi Wedding"
];

export const paketList: Paket[] = [
  ...allPaket.filter((p) => topTitles.includes(p.title)).sort((a, b) => topTitles.indexOf(a.title) - topTitles.indexOf(b.title)),
  ...allPaket.filter((p) => !topTitles.includes(p.title)),
];
