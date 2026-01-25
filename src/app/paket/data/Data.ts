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
    features: [
      "Fotografer Profesional (6 Jam)",
      "Unlimited Photoshoot",
      "Semua File Foto (Google Drive)",
      "Foto Yang Sudah Di Edit",
      "Link Dokumentasi Online",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "PAKET VIDEO",
    subtitle: "Paket full layanan Video 8 jam Kerja",
    price: "Rp1.200.000",
    features: [
      "Videografer Profesional (8 Jam)",
      "Kualitas Video Full HD",
      "Background Music Bebas Pilih",
      "Revisi Video 1x",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "PAKET FOTO DAN VIDEO",
    subtitle: "Paket full layanan Foto dan Video 8 jam Kerja",
    price: "Rp1.500.000",
    features: [
      "Tim Foto & Video (8 Jam)",
      "Video Cinematic & Highlight Teaser",
      "Album Digital Eksklusif",
      "Foto Prewedding (Outdoor Bali)",
      "Bonus Undangan Web (Subdomain)",
      "Penyimpanan Cloud 1 Tahun",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Web Undangan (Subdomain)",
    subtitle: "Layanan Web Undangan Digital Ekonomis",
    price: "Rp150.000",
    features: [
      "Link Undangan (subdomain.web.com)",
      "Galeri Foto (Maks 20 Foto)",
      "Navigasi Lokasi (Google Maps)",
      "RSVP & Ucapan Real-time",
      "Background Music (Autoplay)",
      "Aktif Selama 6 Bulan",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Web Undangan (Custom Domain)",
    subtitle: "Layanan Web Undangan Premium & Personal",
    price: "Rp300.000",
    features: [
      "Domain Custom (.com / .my.id)",
      "Galeri Foto & Video Unlimited",
      "Navigasi Lokasi & Countdown",
      "RSVP & Manajemen Tamu",
      "Fitur Kirim Kado Digital",
      "Masa Aktif 1 Tahun",
    ],
    buttonText: "Pilih Paket Ini",
  },
  {
    title: "Web Undangan Event Lainnya",
    subtitle: "Undangan Digital untuk Ultah, Event & Khitan",
    price: "Rp150.000",
    features: [
      "Tema Custom sesuai Acara",
      "Formulir Pendaftaran/RSVP",
      "Countdown Acara",
      "Integrasi Media Sosial",
      "Link Mudah Dibagikan",
      "Aktif Selama 6 Bulan",
    ],
    buttonText: "Pilih Paket Ini",
  },
];
