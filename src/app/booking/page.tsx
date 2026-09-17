"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
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
  Upload,
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
const REQUEST_TIMEOUT_MS = 60_000;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    snap: any;
  }
}

function formatHarga(hargaRaw: string, tipePembayaran: string = "Lunas") {
  const amountStr = hargaRaw.replace(/[^0-9]/g, "");
  if (!amountStr) return hargaRaw;
  const grossAmount = parseInt(amountStr, 10);
  
  if (tipePembayaran === "DP") {
    const dpAmount = Math.floor(grossAmount / 2);
    return `Rp ${dpAmount.toLocaleString("id-ID")}`;
  }
  
  return hargaRaw; 
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const availableOptions = useMemo(() => {
    if (!serviceParam) return KATEGORI_BOOKING;

    const terpilih = resolveKategori(serviceParam);

    if (terpilih.kategori.startsWith("Photobooth Softcopy")) {
      return KATEGORI_BOOKING.filter((k) => k.value.startsWith("Photobooth Softcopy"));
    }
    if (terpilih.kategori.startsWith("Photobooth Limited Print")) {
      return KATEGORI_BOOKING.filter((k) => k.value.startsWith("Photobooth Limited Print"));
    }
    if (terpilih.kategori.startsWith("Photobooth Unlimited Print")) {
      return KATEGORI_BOOKING.filter((k) => k.value.startsWith("Photobooth Unlimited Print"));
    }

    return KATEGORI_BOOKING.filter((k) => k.value === terpilih.kategori);
  }, [serviceParam]);

  const [formData, setFormData] = useState(() => {
    const terpilih = resolveKategori(serviceParam);

    return {
      namaClient: searchParams.get("name") || "",
      contact: searchParams.get("phone") || "+62",
      email: searchParams.get("email") || "",
      kategoriJasa: terpilih.kategori,
      baseHarga: terpilih.harga,
      harga: terpilih.harga,
      tanggalEvent: searchParams.get("date") || "",
      jamEvent: "",
      lokasi: searchParams.get("location") || "",
      keterangan: terpilih.paketAsli
        ? `Paket dipilih: ${terpilih.paketAsli}`
        : "",
      tipePembayaran: "DP",
      metodePembayaran: "Transfer",
    };
  });

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [formStep, setFormStep] = useState(1);
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
      setBookingsFailed(true);
    } finally {
      if (!signal?.aborted) setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchBookings(controller.signal);

    return () => {
      controller.abort();
    };
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

  useEffect(() => {
    const tanggal = formData.tanggalEvent;
    if (!tanggal) return;
    if (!isTanggalPenuh(bookings, tanggal, grupAktif)) return;

    setKonflikTanggal(tanggal);
    setFormData((prev) => ({ ...prev, tanggalEvent: "" }));
  }, [bookings, grupAktif, formData.tanggalEvent]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTanggalPenuh(bookings, formData.tanggalEvent, grupAktif)) {
      setErrorMessage(
        "Tanggal ini sudah penuh untuk kategori yang dipilih. Silakan pilih tanggal lain.",
      );
      setStatus("error");
      return;
    }
    setFormStep(2);
    setErrorMessage("");
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (isTanggalPenuh(bookings, formData.tanggalEvent, grupAktif)) {
      setErrorMessage("Tanggal ini sudah penuh. Silakan pilih tanggal lain.");
      setStatus("error");
      setFormStep(1);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const { ...restData } = formData;
      
      // Hapus simbol '+' agar tidak error format formula di Spreadsheet
      restData.contact = restData.contact.replace(/\+/g, "");
      const orderId = `BOOKING-${Date.now()}`;

      const formDataToSend = new FormData();
      Object.entries(restData).forEach(([key, value]) => {
        formDataToSend.append(key, value as string);
      });
      formDataToSend.append("payment_status", "Menunggu Konfirmasi");
      formDataToSend.append("order_id", orderId);
      if (file) {
        formDataToSend.append("buktiTransfer", file);
      } else {
        setErrorMessage("Silakan upload bukti pembayaran terlebih dahulu.");
        setStatus("error");
        return;
      }

      const n8nResponse = await fetch(BOOKING_WEBHOOK_URL, {
        method: "POST",
        body: formDataToSend,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (n8nResponse.status === 409) {
        const detail = await n8nResponse.json().catch(() => null);
        setErrorMessage(
          detail?.message ??
          "Maaf, tanggal ini baru saja penuh. Silakan pilih tanggal lain.",
        );
        setStatus("error");
        setFormStep(1);
        fetchBookings(); // segarkan kalender
        return;
      }

      if (!n8nResponse.ok) {
        throw new Error(`Server membalas ${n8nResponse.status}`);
      }

      setStatus("success");

    } catch (error) {
      console.error("Gagal memproses booking:", error);
      const isTimeout =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");

      setErrorMessage(
        isTimeout
          ? "Server terlalu lama merespons. Periksa koneksi Anda, lalu coba lagi."
          : error instanceof Error ? error.message : "Booking gagal diproses. Silakan coba lagi."
      );
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    let { name, value } = e.target;

    // Hanya izinkan angka untuk input kontak/WhatsApp
    if (name === "contact") {
      value = value.replace(/[^0-9+]/g, "");
    }

    if (name === "kategoriJasa") {
      const baseHarga =
        KATEGORI_BOOKING.find((k) => k.value === value)?.harga ?? "";
      setKonflikTanggal("");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        baseHarga,
        harga: formatHarga(baseHarga, prev.tipePembayaran),
      }));
    } else if (name === "tipePembayaran") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        harga: formatHarga(prev.baseHarga, value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file maksimal 5MB");
        return;
      }
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  if (status === "success") {
    const selectedDate = getSelectedDate();
    const tanggalTampil = selectedDate
      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
        selectedDate,
      )
      : formData.tanggalEvent;

    const waText = `Halo Inferno Creative, saya baru saja melakukan booking atas nama *${formData.namaClient}* untuk jasa *${formData.kategoriJasa}*. Berikut adalah bukti pembayaran saya.`;
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
            Kami akan segera memproses booking Anda. Silakan hubungi kami via WhatsApp jika ada pertanyaan.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 text-lg"
          >
            <MessageCircle size={20} />
            <span>Hubungi via WhatsApp</span>
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
      {formStep === 1 ? (
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Beranda
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setFormStep(1)}
          className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Kembali ke Data Pemesanan
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {formStep === 1 ? "Detail Booking" : "Detail Pembayaran"}
          </h1>
          <p className="text-white/70">
            {formStep === 1 
              ? "Lengkapi data di bawah ini untuk memproses pemesanan Anda." 
              : "Selesaikan pembayaran untuk mengonfirmasi pesanan Anda."}
          </p>
        </div>

        <form onSubmit={formStep === 1 ? handleNextStep : handleSubmit} className="space-y-6">
          {formStep === 1 && (<>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">Nama Client *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><User size={20} /></div>
                <input type="text" name="namaClient" placeholder="Nama Lengkap" value={formData.namaClient} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">Nomor WhatsApp *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Phone size={20} /></div>
                <input type="tel" name="contact" placeholder="081234567890" value={formData.contact} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">Email *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Mail size={20} /></div>
                <input type="email" name="email" placeholder="email@contoh.com" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">Kategori Jasa *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Camera size={20} /></div>
                <select name="kategoriJasa" value={formData.kategoriJasa} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 appearance-none outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer" style={{ colorScheme: "dark" }} required>
                  {availableOptions.map((kategori) => (
                    <option key={kategori.value} value={kategori.value} className="text-gray-900">{kategori.value}</option>
                  ))}
                </select>
              </div>
              {formData.kategoriJasa.toLowerCase().includes("photobooth") && (
                <p className="text-white/50 text-xs ml-1 flex items-start gap-1 mt-1"><Info size={12} className="shrink-0 mt-0.5" />Silakan klik kolom di atas untuk mengubah durasi jam photobooth.</p>
              )}
            </div>

            <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium ml-1">Lokasi *</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><MapPin size={20} /></div>
                  <input type="text" name="lokasi" placeholder="Ketik lokasi acara..." value={formData.lokasi} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30" required />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">Tanggal Event *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 z-10 pointer-events-none"><Calendar size={20} /></div>
                <DatePicker selected={getSelectedDate()} onChange={handleDateChange} filterDate={(date) => !isDateDisabled(date)} minDate={new Date()} dateFormat="dd MMMM yyyy" locale={id} placeholderText={isLoadingBookings ? "Memuat kalender..." : "Pilih tanggal"} disabled={isLoadingBookings} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30" wrapperClassName="w-full" required />
              </div>
              {konflikTanggal && <p className="text-amber-300/90 text-xs ml-1 flex items-start gap-1 mt-1"><AlertCircle size={12} className="shrink-0 mt-0.5" />Tanggal sudah penuh untuk kategori ini. Silakan pilih tanggal lain.</p>}
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

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium ml-1">Jam Event *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"><Clock size={20} /></div>
                <input type="time" name="jamEvent" value={formData.jamEvent} onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all" style={{ colorScheme: "dark" }} required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm font-medium ml-1">Keterangan Tambahan</label>
            <div className="relative">
              <div className="absolute left-3 top-4 text-white/50"><FileText size={20} /></div>
              <textarea name="keterangan" placeholder="Detail tambahan, request khusus, atau pertanyaan..." value={formData.keterangan} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30 resize-none" />
            </div>
          </div>
          </>)}

          {formStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-white/60 shrink-0">Jasa / Paket</span>
                    <span className="text-white font-medium text-right">{formData.kategoriJasa}</span>
                  </div>
                  {formData.keterangan && formData.keterangan.startsWith("Paket dipilih:") && (
                    <div className="flex justify-between gap-4">
                      <span className="text-white/60 shrink-0">Detail</span>
                      <span className="text-white font-medium text-right text-xs opacity-80">{formData.keterangan.replace("Paket dipilih:", "").trim()}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-white/60 shrink-0">Tanggal Event</span>
                    <span className="text-white font-medium text-right">
                      {formData.tanggalEvent ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(formData.tanggalEvent)) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
                    <span className="text-white/80 font-medium">Total Harga</span>
                    <span className="text-white font-bold">{formData.baseHarga}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-white/90 text-sm font-medium ml-1">Pilih Opsi Pembayaran *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => handleChange({ target: { name: 'tipePembayaran', value: 'DP' } } as any)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.tipePembayaran === 'DP' ? 'border-red-600 bg-white/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">DP (50%)</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${formData.tipePembayaran === 'DP' ? 'border-red-600' : 'border-white/30'}`}>
                        {formData.tipePembayaran === 'DP' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatHarga(formData.baseHarga, 'DP')}</p>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">Bayar setengah di awal untuk mengamankan jadwal. Sisa dilunasi maksimal H-1 event.</p>
                  </div>

                  <div 
                    onClick={() => handleChange({ target: { name: 'tipePembayaran', value: 'Lunas' } } as any)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.tipePembayaran === 'Lunas' ? 'border-red-600 bg-white/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">Lunas (100%)</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${formData.tipePembayaran === 'Lunas' ? 'border-red-600' : 'border-white/30'}`}>
                        {formData.tipePembayaran === 'Lunas' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{formData.baseHarga}</p>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">Bayar penuh di awal agar tidak repot memikirkan sisa nanti.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-white/90 text-sm font-medium ml-1">Pilih Metode Pembayaran *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => handleChange({ target: { name: 'metodePembayaran', value: 'Transfer' } } as any)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${formData.metodePembayaran === 'Transfer' ? 'border-red-600 bg-white/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-lg text-white">
                        <CreditCard size={20} />
                      </div>
                      <span className="font-semibold text-white">Transfer Bank</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.metodePembayaran === 'Transfer' ? 'border-red-600' : 'border-white/30'}`}>
                      {formData.metodePembayaran === 'Transfer' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>}
                    </div>
                  </div>

                  <div 
                    onClick={() => handleChange({ target: { name: 'metodePembayaran', value: 'QRIS' } } as any)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${formData.metodePembayaran === 'QRIS' ? 'border-red-600 bg-white/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-lg text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                      </div>
                      <span className="font-semibold text-white">QRIS (E-Wallet)</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.metodePembayaran === 'QRIS' ? 'border-red-600' : 'border-white/30'}`}>
                      {formData.metodePembayaran === 'QRIS' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-4">
                <h3 className="text-white font-semibold mb-4">Instruksi Pembayaran</h3>
                {formData.metodePembayaran === "Transfer" ? (
                  <div className="space-y-4 text-white/80">
                    <p>Silakan transfer sejumlah <strong className="text-white font-bold text-lg">{formData.harga}</strong> ke rekening berikut:</p>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="bg-white p-3 rounded-xl self-start sm:self-center flex items-center justify-center shadow-inner">
                        <span className="text-blue-600 font-black text-xl italic tracking-tighter leading-none">BCA</span>
                      </div>
                      <div>
                        <p className="text-2xl font-mono text-white tracking-widest drop-shadow-md">6690955278</p>
                        <p className="text-sm text-white/50 uppercase tracking-wider mt-1">A.N. I MADE WISNU PRADNYA YOGA</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 flex items-start gap-2 mt-2">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      Silakan upload bukti transfer Anda pada kolom di bawah ini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-white/80 text-center flex flex-col items-center">
                    <p>Silakan scan QRIS berikut menggunakan aplikasi m-Banking atau e-Wallet Anda sejumlah <strong className="text-white font-bold text-lg">{formData.harga}</strong>:</p>
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-xl my-2">
                      <img src="/QRIS/QRIS.jpeg" alt="QRIS Inferno Creative" className="w-56 h-56 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-56 h-56 flex flex-col items-center justify-center bg-slate-100 text-slate-500 border-2 border-dashed border-slate-300 rounded-xl text-sm">
                        <Upload size={24} className="mb-2 opacity-50" />
                        <span>Gambar QRIS tidak ditemukan</span>
                        <span className="text-xs opacity-70 mt-1">(Upload file QRIS.jpeg ke folder public/QRIS/)</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 flex items-start gap-2 text-left w-full max-w-md">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      Silakan upload bukti pembayaran QRIS Anda pada kolom di bawah ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Bukti */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-4">
                <label className="text-white/90 text-sm font-medium mb-3 block">
                  Upload Bukti Pembayaran *
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full text-white/70 text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 transition-all cursor-pointer file:cursor-pointer bg-white/5 border border-white/10 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-white"
                    required
                  />
                  <p className="text-white/40 text-xs flex items-center gap-1">
                    <Info size={12} />
                    Format didukung: JPG, PNG, PDF (Maks. 5MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            {status === "error" && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl p-4 mb-4">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {formStep === 1 ? (
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-red-700/30 flex items-center justify-center gap-2 text-lg"
              >
                Lanjut ke Pembayaran
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-700/50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-red-700/30 flex items-center justify-center gap-2 text-lg"
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
                      {status === "error" ? "Coba Kirim Lagi" : "Selesaikan Pemesanan"}
                    </span>
                  </>
                )}
              </button>
            )}
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
