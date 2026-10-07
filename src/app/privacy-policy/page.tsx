import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import FooterSection from "@/components/layout/Footer";
import {
  ShieldCheck,
  FileText,
  Database,
  Calendar,
  Lock,
  Server,
  UserCheck,
  Cookie,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Info,
  Clock,
  Instagram,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Inferno Creative",
  description:
    "Kebijakan Privasi Inferno Creative menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi pengguna layanan dokumentasi foto/video, photobooth, dan undangan digital.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Inferno Creative",
    description:
      "Kebijakan Privasi resmi Inferno Creative untuk layanan dokumentasi foto & video, photobooth, dan undangan digital Bali.",
    url: "https://www.inferno-production.com/privacy-policy",
    siteName: "Inferno Creative",
    locale: "id_ID",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "7 Oktober 2026";

  const tableOfContents = [
    { id: "pendahuluan", label: "1. Pendahuluan & Gambaran Umum" },
    { id: "informasi-dikumpulkan", label: "2. Informasi yang Kami Kumpulkan" },
    { id: "tujuan-penggunaan", label: "3. Tujuan Penggunaan Data" },
    { id: "integrasi-pihak-ketiga", label: "4. Integrasi Layanan Pihak Ketiga" },
    { id: "google-api-oauth", label: "5. Kebijakan Google API & Google OAuth" },
    { id: "keamanan-data", label: "6. Keamanan Data Pengguna" },
    { id: "penyimpanan-data", label: "7. Penyimpanan & Retensi Data" },
    { id: "hak-pengguna", label: "8. Hak Pengguna atas Data" },
    { id: "cookies-teknologi", label: "9. Cookies & Teknologi Penyimpanan" },
    { id: "perubahan-kebijakan", label: "10. Perubahan Privacy Policy" },
    { id: "kontak", label: "11. Informasi Kontak Resmi" },
  ];

  return (
    <div
      className="min-h-screen text-white antialiased flex flex-col justify-between"
      style={{ background: "var(--color-background-solid)" }}
    >
      {/* Top Bar / Header Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#2b0202]/85 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-200"
          >
            <Image
              src="/logo/Asset-2.png"
              alt="Inferno Creative Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/80 hover:text-white px-3 sm:px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
        {/* Hero Title Section */}
        <div className="text-center sm:text-left mb-10 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-700/50 mb-4">
            <ShieldCheck size={14} className="text-red-400" />
            Dokumen Resmi Kebijakan Privasi
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white font-montserrat">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/80 max-w-3xl leading-relaxed">
            Kebijakan Privasi untuk <strong className="text-white">Inferno Creative</strong> (
            <span className="text-[var(--color-gold)]">https://www.inferno-production.com</span>).
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs sm:text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <Clock size={15} className="text-red-400" />
              <span>Terakhir Diperbarui: <strong>{lastUpdated}</strong></span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Info size={15} className="text-red-400" />
              <span>Berlaku untuk seluruh pengunjung & pelanggan website</span>
            </div>
          </div>
        </div>

        {/* Quick Jump Index */}
        <nav
          aria-label="Daftar Isi"
          className="mb-12 p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)] mb-4 flex items-center gap-2">
            <FileText size={16} />
            Daftar Isi Kebijakan Privasi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-white/70 hover:text-white hover:underline flex items-center gap-2 py-1 transition-colors"
              >
                <span className="text-red-400 font-medium">›</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Content Sections */}
        <div className="space-y-12 leading-relaxed text-white/85 text-sm sm:text-base">
          {/* 1. Pendahuluan */}
          <section id="pendahuluan" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <FileText size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                1. Pendahuluan & Gambaran Umum
              </h2>
            </div>
            <p>
              Kebijakan Privasi ini menjelaskan bagaimana <strong>Inferno Creative</strong> (&quot;kami&quot;, &quot;kita&quot;, atau &quot;milik kami&quot;) mengumpulkan, menggunakan, menyimpan, memproses, dan melindungi informasi pribadi pengguna ketika mengunjungi situs web resmi kami di{" "}
              <a
                href="https://www.inferno-production.com"
                className="text-[var(--color-gold)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.inferno-production.com
              </a>{" "}
              serta saat menggunakan berbagai layanan kreatif kami, termasuk jasa dokumentasi fotografi & videografi (wedding, prewedding, event, corporate), photobooth, pembuatan website undangan digital, dan layanan event terkait.
            </p>
            <p>
              Kami sangat menghargai privasi Anda dan berkomitmen penuh untuk menjaga transparansi serta melindungi integritas setiap data pribadi yang Anda percayakan kepada kami selama proses reservasi, komunikasi, dan penyampaian layanan.
            </p>
          </section>

          {/* 2. Informasi yang Kami Kumpulkan */}
          <section id="informasi-dikumpulkan" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Database size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                2. Informasi yang Kami Kumpulkan
              </h2>
            </div>
            <p>
              Untuk memproses kebutuhan reservasi layanan dokumentasi dan operasional kami secara akurat, kami dapat mengumpulkan jenis informasi berikut saat Anda menggunakan formulir booking atau berinteraksi dengan situs kami:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-red-400" />
                  Identitas & Kontak Pribadi
                </h3>
                <ul className="list-disc list-inside text-white/70 space-y-1 text-sm pl-1">
                  <li><strong>Nama lengkap:</strong> Untuk identifikasi pemesan/klien.</li>
                  <li><strong>Nomor telepon / WhatsApp:</strong> Untuk konfirmasi dan komunikasi operasional.</li>
                  <li><strong>Alamat email:</strong> Untuk pengiriman konfirmasi, invoice, dan komunikasi resmi.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-red-400" />
                  Rincian Acara & Reservasi
                </h3>
                <ul className="list-disc list-inside text-white/70 space-y-1 text-sm pl-1">
                  <li><strong>Tanggal & waktu acara:</strong> Untuk pengecekan ketersediaan slot jadwal.</li>
                  <li><strong>Lokasi acara:</strong> Untuk pengaturan penugasan tim kreatif di lokasi.</li>
                  <li><strong>Paket atau layanan:</strong> Paket foto/video, photobooth, atau undangan digital yang dipilih.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-red-400" />
                  Informasi Pembayaran & Bukti
                </h3>
                <ul className="list-disc list-inside text-white/70 space-y-1 text-sm pl-1">
                  <li><strong>Data transaksi:</strong> ID Pemesanan (Order ID), nominal, serta metode pembayaran (DP / Lunas).</li>
                  <li><strong>Bukti transfer:</strong> File gambar atau dokumen bukti pembayaran jika Anda memilih verifikasi manual.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-red-400" />
                  Informasi Teknis Dasar
                </h3>
                <ul className="list-disc list-inside text-white/70 space-y-1 text-sm pl-1">
                  <li><strong>Log teknis peramban:</strong> Tipe perangkat, sistem operasi, dan browser untuk memastikan situs dapat diakses dan berfungsi semestinya.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Tujuan Penggunaan Data */}
          <section id="tujuan-penggunaan" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Server size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                3. Tujuan Penggunaan Data
              </h2>
            </div>
            <p>
              Kami menggunakan informasi pribadi yang dikumpulkan semata-mata untuk tujuan operasional dan administratif yang sah, yaitu:
            </p>
            <ul className="space-y-2.5 text-white/80">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Memproses reservasi pelanggan:</strong> Mendaftarkan detail jadwal sesi foto/video, photobooth, atau pembuatan undangan digital Anda.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Menghubungi pelanggan terkait reservasi:</strong> Melakukan konfirmasi jadwal, berdiskusi mengenai konsep kreatif, dan memberikan pembaruan layanan melalui WhatsApp atau email.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Mengelola jadwal dan ketersediaan layanan:</strong> Memastikan slot tanggal tidak bertabrakan (bentrok jadwal) serta mengatur jadwal kerja kru fotografer/videografer.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Memproses pembayaran:</strong> Memfasilitasi pembayaran uang muka (DP) atau pelunasan dengan aman.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Mengirim konfirmasi reservasi & invoice:</strong> Mengirimkan ringkasan bukti pemesanan, faktur tagihan resmi, atau tanda terima pembayaran.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Mengelola operasional melalui sistem internal:</strong> Mengkoordinasikan penugasan tim kreatif dan logistik peralatan acara.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Meningkatkan kualitas layanan dan website:</strong> Mengevaluasi performa fungsional formulir pemesanan dan website agar semakin responsif.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></span>
                <span><strong>Menjalankan otomatisasi administrasi:</strong> Memastikan pencatatan status booking berlangsung cepat, akurat, dan tanpa kesalahan manual.</span>
              </li>
            </ul>
          </section>

          {/* 4. Integrasi Pihak Ketiga */}
          <section id="integrasi-pihak-ketiga" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Calendar size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                4. Integrasi Layanan Pihak Ketiga
              </h2>
            </div>
            <p>
              Untuk mendukung keandalan dan efisiensi operasional kami, Inferno Creative bermitra dengan penyedia layanan pihak ketiga yang terpercaya. Layanan pihak ketiga yang digunakan meliputi:
            </p>
            <div className="space-y-3 mt-3">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <h3 className="font-semibold text-white text-base">Google Sheets</h3>
                <p className="text-white/70 text-sm mt-1">
                  Digunakan untuk penyimpanan, pengelolaan rekap data pemesanan, serta pemantauan kuota reservasi secara terstruktur oleh tim administrasi internal.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <h3 className="font-semibold text-white text-base">Google Calendar</h3>
                <p className="text-white/70 text-sm mt-1">
                  Digunakan untuk pengelolaan jadwal acara dan sinkronisasi tanggal kegiatan tim produksi agar setiap acara terdokumentasikan tepat waktu.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <h3 className="font-semibold text-white text-base">n8n (Workflow Automation)</h3>
                <p className="text-white/70 text-sm mt-1">
                  Digunakan sebagai sistem otomatisasi alur kerja (workflow engine) yang memproses formulir reservasi dan meneruskan data pemesanan ke sistem administrasi internal secara terenkripsi.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <h3 className="font-semibold text-white text-base">DOKU Payment Gateway</h3>
                <p className="text-white/70 text-sm mt-1">
                  Digunakan untuk memproses transaksi pembayaran online secara aman (melalui QRIS, Virtual Account, kartu, atau dompet digital) sesuai standar sertifikasi keamanan perbankan (PCI-DSS).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <h3 className="font-semibold text-white text-base">Google Drive</h3>
                <p className="text-white/70 text-sm mt-1">
                  Digunakan secara aman apabila diperlukan untuk pengarsipan dokumen pemesanan atau bukti transfer pembayaran yang diunggah oleh pelanggan.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-700/50 mt-4">
              <p className="text-sm text-red-200">
                <strong>Komitmen Perlindungan:</strong> Kami <strong>tidak pernah menjual, menyewakan, memperdagangkan, atau membagikan</strong> informasi pribadi Anda kepada pihak ketiga mana pun untuk tujuan periklanan, pemasaran komersial pihak ketiga, atau monetisasi data.
              </p>
            </div>
          </section>

          {/* 5. Google API / Google OAuth */}
          <section id="google-api-oauth" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Lock size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                5. Kebijakan Google API & Google OAuth
              </h2>
            </div>
            <p>
              Aplikasi dan sistem administrasi Inferno Creative dapat menggunakan integrasi antarmuka pemrograman aplikasi (API) Google, khususnya <strong>Google Sheets API</strong> dan <strong>Google Calendar API</strong>, untuk kebutuhan pengelolaan jadwal reservasi dan pencatatan administratif.
            </p>
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/15 space-y-3">
              <h3 className="text-base font-semibold text-[var(--color-gold)] flex items-center gap-2">
                <ShieldCheck size={18} />
                Ketentuan Penggunaan Izin Google OAuth
              </h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Tujuan Fungsional Terbatas:</strong> Apabila pengguna atau staf memberikan izin otorisasi melalui Google OAuth, data hanya digunakan sesuai dengan izin spesifik yang diberikan dan semata-mata untuk mengelola reservasi dan jadwal kegiatan Inferno Creative.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Prinsip Hak Akses Minimal (Least Privilege):</strong> Sistem kami tidak meminta permission atau cakupan izin (scopes) Google yang tidak relevan atau tidak diperlukan untuk operasional reservasi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Kepatuhan terhadap Kebijakan Google:</strong> Penggunaan dan transfer data apa pun yang diterima dari Google API oleh Inferno Creative ke aplikasi lain akan sepenuhnya mematuhi ketentuan <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold)] underline inline-flex items-center gap-1">Google API Services User Data Policy <ExternalLink size={12} /></a>, termasuk persyaratan <em>Limited Use</em> (Penggunaan Terbatas).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Tidak untuk Pelatihan AI / Model Bahasa:</strong> Data yang diperoleh melalui Google Workspace API tidak pernah digunakan untuk melatih model kecerdasan buatan umum (generalized AI/ML models) atau dibagikan kepada broker data.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Keamanan Data */}
          <section id="keamanan-data" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                6. Keamanan Data Pengguna
              </h2>
            </div>
            <p>
              Inferno Creative berupaya menerapkan langkah-langkah teknis dan organisatoris yang wajar dan proporsional untuk melindungi data pribadi pengguna dari risiko akses yang tidak sah, pengubahan, pengungkapan, kehilangan, atau perusakan yang tidak disengaja.
            </p>
            <p>
              Langkah-langkah tersebut mencakup penggunaan protokol komunikasi aman (HTTPS/SSL/TLS), pembatasan akses kredensial hanya kepada personel yang berwenang, dan penerapan kontrol akses berbasis peran (role-based access control).
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-white/70 text-sm">
              <p>
                <strong>Pemberitahuan Wajar:</strong> Meskipun kami berusaha semaksimal mungkin menerapkan standar perlindungan yang layak, tidak ada metode transmisi data melalui jaringan internet atau metode penyimpanan elektronik di dunia yang dapat dijamin 100% sepenuhnya aman dari segala ancaman siber. Kami senantiasa meninjau prosedur keamanan kami untuk menjaga kerahasiaan data Anda.
              </p>
            </div>
          </section>

          {/* 7. Penyimpanan & Retensi Data */}
          <section id="penyimpanan-data" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Database size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                7. Penyimpanan & Retensi Data
              </h2>
            </div>
            <p>
              Data pribadi pengguna akan disimpan hanya selama diperlukan untuk memenuhi tujuan operasional, pemrosesan transaksi pemesanan, penjadwalan acara, serta pencatatan akuntansi dan administrasi yang relevan.
            </p>
            <p>
              Apabila data tidak lagi diperlukan untuk pelaksanaan layanan atau pemenuhan kewajiban administratif yang sah, data tersebut dapat dihapus secara permanen atau diarsipkan secara aman dengan pembatasan akses.
            </p>
          </section>

          {/* 8. Hak Pengguna */}
          <section id="hak-pengguna" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <UserCheck size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                8. Hak Pengguna atas Data Pribadi
              </h2>
            </div>
            <p>
              Sebagai pemilik data pribadi, Anda memiliki hak-hak berikut terkait informasi Anda yang kami simpan:
            </p>
            <ul className="space-y-3 text-white/80">
              <li className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <strong>Hak Akses dan Konfirmasi:</strong> Anda berhak menanyakan apakah kami menyimpan data pribadi Anda serta meminta rincian informasi data tersebut.
              </li>
              <li className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <strong>Hak Koreksi (Perbaikan):</strong> Anda berhak meminta pembaruan atau perbaikan atas data pribadi Anda yang tidak akurat, tidak lengkap, atau telah kedaluwarsa (misalnya perubahan nomor WhatsApp atau tanggal acara).
              </li>
              <li className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <strong>Hak Penghapusan (Erasure):</strong> Anda berhak meminta penghapusan data pribadi Anda dari sistem kami sepanjang permohonan tersebut tidak bertentangan dengan kewajiban hukum, perpajakan, atau penyelesaian transaksi pemesanan yang sedang berjalan.
              </li>
            </ul>
            <p className="text-sm text-white/70">
              Untuk menggunakan hak-hak di atas, Anda dapat menghubungi kami secara langsung melalui kontak resmi yang tercantum di bagian akhir dokumen ini.
            </p>
          </section>

          {/* 9. Cookies & Teknologi Penyimpanan */}
          <section id="cookies-teknologi" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Cookie size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                9. Cookies & Teknologi Penyimpanan
              </h2>
            </div>
            <p>
              Website kami menggunakan teknologi penyimpanan dasar untuk mendukung fungsionalitas dan kenyamanan navigasi Anda:
            </p>
            <ul className="space-y-2 text-white/80 list-disc list-inside">
              <li><strong>Local Storage & Session Storage:</strong> Digunakan untuk mempertahankan status pengisian formulir sementara (misalnya draft langkah booking) agar data Anda tidak hilang saat berpindah tahap formulir.</li>
              <li><strong>Cookies Esensial:</strong> Digunakan untuk fungsi teknis peramban yang diperlukan agar situs dapat beroperasi dengan lancar.</li>
              <li><strong>Analitik Performa Web:</strong> Kami memanfaatkan alat pemantauan performa web terintegrasi (seperti Vercel Analytics dan Speed Insights) untuk mengukur kecepatan halaman dan performa situs secara agregat dan anonim. Platform kami <strong>tidak</strong> menyematkan Google Analytics.</li>
            </ul>
            <p className="text-sm text-white/70">
              Anda dapat mengontrol atau menolak penggunaan cookies melalui pengaturan peramban internet Anda. Namun, mematikan fungsi tertentu dapat memengaruhi kenyamanan Anda dalam mengisi formulir pemesanan.
            </p>
          </section>

          {/* 10. Perubahan Privacy Policy */}
          <section id="perubahan-kebijakan" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <RefreshCw size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                10. Perubahan Kebijakan Privasi
              </h2>
            </div>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu guna menyesuaikan dengan perkembangan operasional layanan, penambahan fitur teknologi baru, atau pemenuhan kepatuhan hukum yang berlaku.
            </p>
            <p>
              Setiap pembaruan akan dipublikasikan langsung pada halaman ini dengan mencantumkan tanggal pembaruan terbaru di bagian atas (&quot;Terakhir Diperbarui&quot;). Kami menyarankan pengguna untuk memeriksa halaman ini secara berkala untuk mengetahui pembaruan terkini.
            </p>
          </section>

          {/* 11. Kontak */}
          <section id="kontak" className="scroll-mt-24 space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-900/40 border border-red-600/30 flex items-center justify-center text-red-400">
                <Mail size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                11. Informasi Kontak Resmi
              </h2>
            </div>
            <p>
              Apabila Anda memiliki pertanyaan, klarifikasi, atau permohonan terkait data pribadi Anda dan Kebijakan Privasi ini, silakan hubungi kami melalui saluran resmi berikut:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Alamat Studio / Workshop</h3>
                    <p className="text-white/70 text-sm mt-0.5">
                      Inferno Creative<br />
                      Br. Angkeb Canging, Ds. Gulingan<br />
                      Kec. Mengwi, Kab. Badung, Bali, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <Phone size={18} className="text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">WhatsApp & Telepon</h3>
                    <a
                      href="https://wa.me/6285645150857"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-sm hover:underline"
                    >
                      +62 856-4515-0857
                    </a>
                    {" / "}
                    <a
                      href="https://wa.me/6281547473104"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-sm hover:underline"
                    >
                      +62 815-4747-3104
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Email Resmi</h3>
                    <a
                      href="mailto:support@inferno-production.com"
                      className="text-white/70 hover:text-white text-sm hover:underline"
                    >
                      support@inferno-production.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <Instagram size={18} className="text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Instagram Resmi</h3>
                    <a
                      href="https://www.instagram.com/inferno.creativee/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-sm hover:underline"
                    >
                      @inferno.creativee
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <ExternalLink size={18} className="text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white text-sm">Website Resmi</h3>
                    <a
                      href="https://www.inferno-production.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-gold)] text-sm hover:underline"
                    >
                      https://www.inferno-production.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-14 pt-8 border-t border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-medium transition-all"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Halaman Utama</span>
          </Link>
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Inferno Creative. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </main>

      {/* Website Global Footer */}
      <FooterSection />
    </div>
  );
}
