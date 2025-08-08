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
    title: "PAKET EKSKLUSIF",
    subtitle: "Paket full layanan dokumentasi & website undangan digital",
    price: "Rp5.500.000",
    features: [
      "Website undangan digital custom domain (.com)",
      "Foto prewedding (outdoor/lokasi bebas di Bali)",
      "Video prewedding cinematic (1 menit)",
      "Dokumentasi hari-H (foto + video cinematic)",
      "Highlight teaser video",
      "Cetak banner 1x",
      "QR Code untuk akses undangan",
      "Link undangan mudah dibagikan",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Undangan Pernikahan",
    subtitle: "Website Undangan Digital",
    price: "Rp300.000",
    features: [
      "Halaman pasangan, acara, lokasi, galeri, RSVP, countdown",
      "Link undangan (subdomain)",
      "Hosting 6 bulan",
      "QR Code (+Rp25.000)",
      "Tambahan domain: .my.id (+Rp50.000), .com (+Rp150.000)",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Undangan Ulang Tahun / 3 Bulanan / Metatah",
    subtitle: "Website Undangan Digital",
    price: "Rp200.000",
    features: ["Fitur sama seperti Undangan Pernikahan, hanya beda tema acara"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Foto Prewedding - 1 Lokasi",
    subtitle: "Jasa Dokumentasi",
    price: "Rp800.000",
    features: ["30-40 edited photos", "1 outfit pergantian", "1 photographer"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Foto Prewedding - 2 Lokasi",
    subtitle: "Jasa Dokumentasi",
    price: "Rp1.200.000",
    features: ["30-40 edited photos", "1 outfit pergantian", "1 photographer"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Video Prewedding",
    subtitle: "Jasa Dokumentasi",
    price: "Rp1.500.000",
    features: [
      "Durasi 1 menit cinematic",
      "Lokasi outdoor",
      "Musik bebas",
      "Dengan drone (jika lokasi mendukung)",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Dokumentasi Hari-H - Foto Saja",
    subtitle: "Jasa Dokumentasi",
    price: "Rp1.000.000",
    features: [],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Dokumentasi Hari-H - Video Saja",
    subtitle: "Jasa Dokumentasi",
    price: "Rp1.200.000",
    features: ["Cinematic + Highlight"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Dokumentasi Hari-H - Foto + Video",
    subtitle: "Jasa Dokumentasi",
    price: "Rp2.000.000",
    features: ["Foto dan Video Cinematic saat hari-H"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Website + Foto Prewedding",
    subtitle: "Paket Terpisah (Bundling Hemat)",
    price: "Rp1.000.000",
    features: ["Web pernikahan", "1 lokasi foto prewed"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Website + Video Prewedding",
    subtitle: "Paket Terpisah (Bundling Hemat)",
    price: "Rp1.300.000",
    features: ["Web pernikahan", "Video prewedding cinematic 1 menit"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Website + Dokumentasi Hari-H",
    subtitle: "Paket Terpisah (Bundling Hemat)",
    price: "Rp2.200.000",
    features: ["Web pernikahan", "Foto dan Video dokumentasi saat hari-H"],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Website + Foto + Video Hari-H",
    subtitle: "Paket Terpisah (Bundling Hemat)",
    price: "Rp2.700.000",
    features: ["Web pernikahan", "Foto + Video dokumentasi hari-H lengkap"],
    buttonText: "Pilih Paket Ini",
  },
];
