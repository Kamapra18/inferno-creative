"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Camera,
  User,
  Phone,
  Send,
  Clock,
  FileText,
  ArrowLeft,
  Info,
  Mail,
  CreditCard,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import {
  KATEGORI_BOOKING,
  grupKategori,
  resolveKategori,
  isTanggalPenuh,
  toDateString,
  type BookingTerdaftar,
} from "@/lib/kuotaBooking";

type Booking = BookingTerdaftar;

// Baris mentah dari Google Sheet lewat n8n. Nama kolomnya mengikuti header
// sheet (ada yang berspasi di akhir), jadi dinormalisasi ke camelCase di sini.
interface SheetRow {
  "TanggalEvent "?: string;
  TanggalEvent?: string;
  KategoriJasa?: string;
}

const toBooking = (row: SheetRow): Booking => ({
  tanggalEvent: (row["TanggalEvent "] ?? row.TanggalEvent ?? "").trim(),
  kategoriJasa: (row.KategoriJasa ?? "").trim(),
});

const WHATSAPP_NUMBER = "6285645150857";
const BOOKING_WEBHOOK_URL =
  "https://n8n.imadegautama.com/webhook/booking-inferno";
const BOOKING_LIST_URL = "https://n8n.imadegautama.com/webhook/databooking";
const REQUEST_TIMEOUT_MS = 20_000;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function hitungHargaDP(hargaRaw: string, statusPembayaran: string) {
  if (statusPembayaran !== "DP") return hargaRaw;

  const angkaOnly = hargaRaw.replace(/[^0-9]/g, "");
  if (!angkaOnly) return hargaRaw;

  const harga = parseInt(angkaOnly, 10);
  const dp = harga / 2;

  const formattedDP = dp.toLocaleString("id-ID");

  return `Rp ${formattedDP}`;
}

function BookingFormContent() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState(() => {
    // ?service= bisa berisi judul paket dari halaman marketing, bukan nama
    // kategori booking — resolveKategori yang menormalkannya.
    const terpilih = resolveKategori(searchParams.get("service"));

    return {
      namaClient: searchParams.get("name") || "",
      contact: searchParams.get("phone") || "",
      email: searchParams.get("email") || "",
      kategoriJasa: terpilih.kategori,
      baseHarga: terpilih.harga,
      harga: hitungHargaDP(terpilih.harga, "DP"),
      statusPembayaran: "DP",
      tanggalEvent: searchParams.get("date") || "",
      jamEvent: "",
      lokasi: searchParams.get("location") || "",
      keterangan: terpilih.paketAsli
        ? `Paket dipilih: ${terpilih.paketAsli}`
        : "",
    };
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsFailed, setBookingsFailed] = useState(false);
  const [konflikTanggal, setKonflikTanggal] = useState("");

  const fetchBookings = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(BOOKING_LIST_URL, { signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rows: unknown = await response.json();
      if (!Array.isArray(rows)) {
        throw new Error("Format data booking tidak dikenali");
      }

      setBookings((rows as SheetRow[]).map(toBooking));
      setBookingsFailed(false);
    } catch (error) {
      if (signal?.aborted) return;
      console.error("Gagal mengambil data booking:", error);
      // Tanpa data ini semua tanggal tampak kosong, jadi user perlu tahu
      // bahwa kuota tanggal sedang tidak terverifikasi.
      setBookingsFailed(true);
    } finally {
      if (!signal?.aborted) setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);
    return () => controller.abort();
  }, [fetchBookings]);

  const getSelectedDate = () => {
    if (!formData.tanggalEvent) return null;
    const [year, month, day] = formData.tanggalEvent.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const handleDateChange = (date: Date | null) => {
    setKonflikTanggal("");
    setFormData((prev) => ({
      ...prev,
      tanggalEvent: date ? toDateString(date) : "",
    }));
  };

  const grupAktif = grupKategori(formData.kategoriJasa);

  const isDateDisabled = (date: Date) => {
    if (!date) return false;
    return isTanggalPenuh(bookings, toDateString(date), grupAktif);
  };

  // Kalender hanya menyaring tanggal saat dibuka, jadi tanggal yang sudah
  // terpilih bisa jadi tidak valid setelah kategori diganti atau setelah data
  // booking termuat (termasuk tanggal yang datang dari ?date=).
  useEffect(() => {
    const tanggal = formData.tanggalEvent;
    if (!tanggal) return;
    if (!isTanggalPenuh(bookings, tanggal, grupAktif)) return;

    setKonflikTanggal(tanggal);
    setFormData((prev) => ({ ...prev, tanggalEvent: "" }));
  }, [bookings, grupAktif, formData.tanggalEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Penjaga terakhir di sisi klien; n8n tetap mengecek ulang saat menulis.
    if (isTanggalPenuh(bookings, formData.tanggalEvent, grupAktif)) {
      setErrorMessage(
        "Tanggal ini sudah penuh untuk kategori yang dipilih. Silakan pilih tanggal lain.",
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const { baseHarga, ...dataToSend } = formData;
      const response = await fetch(BOOKING_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      // n8n menolak dengan 409 kalau slotnya keburu diambil orang lain
      // di antara halaman ini dimuat dan tombol ditekan.
      if (response.status === 409) {
        const detail = await response.json().catch(() => null);
        setErrorMessage(
          detail?.message ??
          "Maaf, tanggal ini baru saja penuh. Silakan pilih tanggal lain.",
        );
        setStatus("error");
        fetchBookings(); // segarkan kalender agar mencerminkan keadaan terbaru
        return;
      }

      // Tanpa cek ini, balasan 500 dari n8n ikut dianggap sukses dan
      // booking hilang diam-diam.
      if (!response.ok) {
        throw new Error(`Server membalas ${response.status}`);
      }

      setStatus("success");
    } catch (error) {
      console.error("Gagal mengirim booking:", error);
      const isTimeout =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");

      setErrorMessage(
        isTimeout
          ? "Server terlalu lama merespons. Periksa koneksi Anda, lalu coba lagi."
          : "Booking gagal dikirim. Data Anda masih tersimpan di form, silakan coba lagi.",
      );
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "kategoriJasa") {
      const baseHarga =
        KATEGORI_BOOKING.find((k) => k.value === value)?.harga ?? "";
      // Peringatan lama tidak relevan lagi untuk kategori baru; kalau tanggalnya
      // ternyata masih bentrok, efek cek ulang akan memunculkannya kembali.
      setKonflikTanggal("");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        baseHarga,
        harga: hitungHargaDP(baseHarga, prev.statusPembayaran),
      }));
    } else if (name === "statusPembayaran") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        harga: hitungHargaDP(prev.baseHarga, value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (status === "success") {
    const selectedDate = getSelectedDate();
    const tanggalTampil = selectedDate
      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
        selectedDate,
      )
      : formData.tanggalEvent;

    const waText = `Halo Inferno Creative, saya baru saja melakukan booking atas nama *${formData.namaClient}* untuk jasa *${formData.kategoriJasa}*. Berikut adalah bukti transfer saya:`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    return (
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl text-center"
        >
          <div className="flex justify-center mb-4 text-green-400">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Booking Berhasil Dikirim!
          </h1>
          <p className="text-white/70 mb-8">
            Terima kasih, {formData.namaClient}. Detail booking Anda sudah kami
            terima.
          </p>

          <dl className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-3 text-left">
            {[
              { label: "Kategori Jasa", value: formData.kategoriJasa },
              { label: "Tanggal", value: tanggalTampil },
              { label: "Jam", value: formData.jamEvent },
              { label: "Lokasi", value: formData.lokasi },
              { label: "Harga", value: formData.harga },
              { label: "Pembayaran", value: formData.statusPembayaran },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between gap-4 text-sm"
              >
                <dt className="text-white/50 shrink-0">{item.label}</dt>
                <dd className="text-white font-medium text-right">
                  {item.value || "-"}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-white/70 text-sm mb-4">
            Langkah terakhir: kirimkan bukti transfer Anda lewat WhatsApp.
          </p>

          {/* Anchor biasa, bukan window.open — supaya tidak diblokir popup
              blocker seperti implementasi sebelumnya. */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 text-lg"
          >
            <MessageCircle size={20} />
            <span>Kirim Bukti Transfer</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center text-white/60 hover:text-white mt-6 text-sm transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Kembali ke Beranda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Detail Booking
          </h1>
          <p className="text-white/70">
            Lengkapi data di bawah ini untuk memproses pemesanan Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Client */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Nama Client *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="namaClient"
                  placeholder="Nama Lengkap"
                  value={formData.namaClient}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/30"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Nomor WhatsApp *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  name="contact"
                  placeholder="081234567890"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/30"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Email *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="email@contoh.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/30"
                  required
                />
              </div>
            </div>

            {/* Kategori Jasa */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Kategori Jasa *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <Camera size={20} />
                </div>
                <select
                  name="kategoriJasa"
                  value={formData.kategoriJasa}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 appearance-none outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                  style={{ colorScheme: "dark" }}
                  required
                >
                  {KATEGORI_BOOKING.map((kategori) => (
                    <option
                      key={kategori.value}
                      value={kategori.value}
                      className="text-gray-900"
                    >
                      {kategori.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Harga *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <Tag size={20} />
                </div>
                <input
                  type="text"
                  name="harga"
                  value={formData.harga}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 text-white/70 rounded-xl py-3 pl-11 pr-4 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Status Pembayaran */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Status Pembayaran *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <CreditCard size={20} />
                </div>
                <select
                  name="statusPembayaran"
                  value={formData.statusPembayaran}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 appearance-none outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                  style={{ colorScheme: "dark" }}
                  required
                >
                  <option value="DP" className="text-gray-900">
                    DP (Down Payment)
                  </option>
                  <option value="Lunas" className="text-gray-900">
                    Lunas
                  </option>
                </select>
              </div>
            </div>

            {/* Lokasi */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Lokasi *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  name="lokasi"
                  placeholder="Lokasi acara secara spesifik"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/30"
                  required
                />
              </div>
            </div>

            {/* Tanggal Event */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Tanggal Event *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 z-10 pointer-events-none">
                  <Calendar size={20} />
                </div>
                <DatePicker
                  selected={getSelectedDate()}
                  onChange={handleDateChange}
                  filterDate={(date) => !isDateDisabled(date)}
                  minDate={new Date()}
                  dateFormat="dd MMMM yyyy"
                  locale={id}
                  placeholderText={
                    isLoadingBookings ? "Memuat kalender..." : "Pilih tanggal"
                  }
                  disabled={isLoadingBookings}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/30"
                  wrapperClassName="w-full"
                  required
                />
              </div>
              {konflikTanggal && (
                <p className="text-amber-300/90 text-xs ml-1 flex items-start gap-1 mt-1">
                  <AlertCircle size={12} className="shrink-0 mt-0.5" />
                  Tanggal{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "long",
                  }).format(new Date(`${konflikTanggal}T00:00:00`))}{" "}
                  sudah penuh untuk kategori ini. Silakan pilih tanggal lain.
                </p>
              )}
              {!isLoadingBookings &&
                (bookingsFailed ? (
                  <p className="text-amber-300/90 text-xs ml-1 flex items-start gap-1 mt-1">
                    <AlertCircle size={12} className="shrink-0 mt-0.5" />
                    Jadwal terisi gagal dimuat, jadi tanggal yang sudah penuh
                    mungkin tidak tercoret. Kami akan konfirmasi ulang
                    ketersediaannya.
                  </p>
                ) : (
                  <p className="text-white/50 text-xs ml-1 flex items-center gap-1 mt-1">
                    <Info size={12} />
                    Tanggal yang dicoret berarti sudah penuh untuk kategori ini.
                  </p>
                ))}
            </div>

            {/* Jam Event */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">
                Jam Event *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                  <Clock size={20} />
                </div>
                <input
                  type="time"
                  name="jamEvent"
                  value={formData.jamEvent}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  style={{ colorScheme: "dark" }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="space-y-2">
            <label className="text-white/90 text-sm font-medium ml-1">
              Keterangan Tambahan
            </label>
            <div className="relative">
              <div className="absolute left-3 top-4 text-white/50">
                <FileText size={20} />
              </div>
              <textarea
                name="keterangan"
                placeholder="Detail tambahan, request khusus, atau pertanyaan..."
                value={formData.keterangan}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-white/30 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {status === "error" && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-4 mb-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 text-lg"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>
                    {status === "error"
                      ? "Coba Kirim Lagi"
                      : "Kirim Data Booking"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4"
      style={{ background: "var(--color-background)" }}
    >
      <Suspense
        fallback={
          <div className="text-white text-center py-20">Loading...</div>
        }
      >
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
