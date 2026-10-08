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
  QrCode,
  ShieldCheck,
  Lock,
  Sparkles,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Upload,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import {
  KATEGORI_BOOKING,
  grupKategori,
  resolveKategori,
  isTanggalPenuh,
  toDateString,
  normalizeDateString,
  type BookingTerdaftar,
} from "@/lib/kuotaBooking";

type Booking = BookingTerdaftar;

interface SheetRow {
  [key: string]: any;
}

const toBooking = (row: SheetRow): Booking => {
  const rawTanggal =
    row["TanggalEvent "] ??
    row["TanggalEvent"] ??
    row["tanggalEvent"] ??
    row["tanggal_event"] ??
    row["Tanggal"] ??
    row["tanggal"] ??
    "";

  const rawKategori =
    row["KategoriJasa"] ??
    row["kategoriJasa"] ??
    row["kategori_jasa"] ??
    row["paket"] ??
    "";

  const rawStatus =
    row["statusPembayaran"] ??
    row["statuspembayaran"] ??
    row["status_pembayaran"] ??
    row["payment_status"] ??
    row["status"] ??
    row["Status"] ??
    "";

  return {
    tanggalEvent: normalizeDateString(String(rawTanggal)),
    kategoriJasa: String(rawKategori).trim(),
    statusPembayaran: String(rawStatus).trim(),
  };
};

const WHATSAPP_NUMBER = "6285645150857";
const BOOKING_WEBHOOK_URL =
  "https://n8n.imadegautama.com/webhook/booking-inferno";
const BOOKING_LIST_URL = "https://n8n.imadegautama.com/webhook/databooking";
const REQUEST_TIMEOUT_MS = 60_000;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    snap?: any;
    loadJokulCheckout?: (url: string) => void;
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

function getNumericHarga(hargaRaw: string, tipePembayaran: string = "Lunas"): number {
  const amountStr = (hargaRaw || "").replace(/[^0-9]/g, "");
  if (!amountStr) return 0;
  const base = parseInt(amountStr, 10);
  return tipePembayaran === "DP" ? Math.floor(base / 2) : base;
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const statusParam = searchParams.get("status");
  const isDokuSuccess = statusParam === "success";

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
    const defaultTipe = "DP";

    return {
      namaClient: searchParams.get("name") || "",
      contact: searchParams.get("phone") || "+62",
      email: searchParams.get("email") || "",
      kategoriJasa: terpilih.kategori,
      baseHarga: terpilih.harga,
      harga: formatHarga(terpilih.harga, defaultTipe),
      tanggalEvent: searchParams.get("date") || "",
      jamEvent: "",
      lokasi: searchParams.get("location") || "",
      keterangan: terpilih.paketAsli
        ? `Paket dipilih: ${terpilih.paketAsli}`
        : "",
      tipePembayaran: defaultTipe,
      metodePembayaran: "DOKU", // DOKU Checkout sebagai opsi utama & instan
    };
  });

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SubmitStatus>(isDokuSuccess ? "success" : "idle");
  const [formStep, setFormStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsFailed, setBookingsFailed] = useState(false);
  const [konflikTanggal, setKonflikTanggal] = useState("");
  const [dokuPaymentUrl, setDokuPaymentUrl] = useState<string>("");
  const [hasSyncedN8n, setHasSyncedN8n] = useState(false);

  // Jika kembali dari callback redirect DOKU Checkout (?status=success), pastikan update n8n menjadi Lunas
  useEffect(() => {
    if (isDokuSuccess && !hasSyncedN8n) {
      const orderId = searchParams.get("order_id");
      const clientName = searchParams.get("name") || formData.namaClient;
      const service = searchParams.get("service") || formData.kategoriJasa;
      const amount = searchParams.get("amount") || formData.harga;
      const isDP = orderId?.includes("-DP-") || formData.tipePembayaran === "DP";
      const targetStatus = isDP ? "DP" : "Lunas";

      if (orderId) {
        setHasSyncedN8n(true);
        fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            clientName,
            service,
            amount,
            status: targetStatus,
            statusPembayaran: targetStatus,
            tipePembayaran: targetStatus,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(`n8n status ${targetStatus} confirmed successfully:`, data);
          })
          .catch((err) => {
            console.warn("Gagal konfirmasi callback n8n:", err);
          });
      }
    }
  }, [isDokuSuccess, hasSyncedN8n, searchParams, formData.namaClient, formData.kategoriJasa, formData.harga, formData.tipePembayaran]);

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
      const isDP = formData.tipePembayaran === "DP";
      const targetStatus = isDP ? "DP" : "Lunas";
      const orderId = `BOOKING-${isDP ? "DP" : "LUNAS"}-${Date.now()}`;

      // ==========================================
      // ALUR 1: PEMBAYARAN VIA DOKU CHECKOUT
      // ==========================================
      if (formData.metodePembayaran === "DOKU") {
        // Simpan data booking ke webhook spreadsheet terlebih dahulu
        try {
          const formDataToSend = new FormData();
          // Pemetaan field persis sesuai n8n & Google Sheets:
          formDataToSend.append("namaClient", restData.namaClient);
          formDataToSend.append("contact", restData.contact);
          formDataToSend.append("kategoriJasa", restData.kategoriJasa);
          formDataToSend.append("tanggalEvent", restData.tanggalEvent);
          formDataToSend.append("jamEvent", restData.jamEvent);
          formDataToSend.append("lokasi", restData.lokasi);
          formDataToSend.append("harga", formData.harga);
          formDataToSend.append("email", restData.email);
          // Status awal saat form disubmit sebelum bayar adalah "Menunggu Pembayaran"
          const initialStatus = "Menunggu Pembayaran";
          formDataToSend.append("statusPembayaran", initialStatus);
          formDataToSend.append("statuspembayaran", initialStatus);
          formDataToSend.append("status_pembayaran", initialStatus);
          formDataToSend.append("payment_status", initialStatus);
          formDataToSend.append("keterangan", restData.keterangan);
          // n8n mapping: {{ $json["Id-Order"] }} dan Id_order
          formDataToSend.append("Id-Order", orderId);
          formDataToSend.append("Id_order", orderId);
          formDataToSend.append("order_id", orderId);
          formDataToSend.append("buktiTransfer", `DOKU Checkout (${initialStatus})`);
          formDataToSend.append("webViewLink", `DOKU Checkout (${initialStatus})`);
          formDataToSend.append("tipePembayaran", formData.tipePembayaran);
          formDataToSend.append("metodePembayaran", "DOKU Checkout");

          // Simpan data order lengkap di storage untuk dikirim kembali saat callback sukses
          const fullOrderData = {
            orderId,
            "Id-Order": orderId,
            Id_order: orderId,
            namaClient: restData.namaClient,
            contact: restData.contact,
            kategoriJasa: restData.kategoriJasa,
            tanggalEvent: restData.tanggalEvent,
            jamEvent: restData.jamEvent,
            lokasi: restData.lokasi,
            harga: formData.harga,
            email: restData.email,
            statusPembayaran: targetStatus, // "DP" jika pilih DP, "Lunas" jika pilih Lunas
            statuspembayaran: targetStatus,
            status: targetStatus,
            tipePembayaran: formData.tipePembayaran,
            keterangan: restData.keterangan,
            metodePembayaran: "DOKU Checkout",
            buktiTransfer: `DOKU Checkout (${targetStatus})`,
            webViewLink: `DOKU Checkout (${targetStatus})`,
          };
          try {
            sessionStorage.setItem("inferno_order_" + orderId, JSON.stringify(fullOrderData));
            localStorage.setItem("inferno_order_" + orderId, JSON.stringify(fullOrderData));
          } catch (e) {
            console.warn("Storage save error:", e);
          }

          await fetch(BOOKING_WEBHOOK_URL, {
            method: "POST",
            body: formDataToSend,
            signal: AbortSignal.timeout(15_000),
          }).catch((err) => {
            console.warn("Gagal simpan n8n, lanjut request pembayaran:", err);
          });
        } catch (webhookErr) {
          console.warn("Webhook n8n error:", webhookErr);
        }

        // Hitung nominal harga bersih untuk gateway
        const grossAmount = getNumericHarga(formData.baseHarga, formData.tipePembayaran);
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : "https://www.inferno-production.com";

        // Clean Callback URL tanpa karakter '?' dan '&' (sesuai aturan ketat DOKU API)
        const callbackUrl = `${origin}/booking/success/${encodeURIComponent(orderId)}`;

        // Request sesi DOKU Checkout ke backend
        const paymentRes = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            grossAmount,
            customerName: formData.namaClient,
            customerEmail: formData.email,
            customerPhone: formData.contact,
            itemName: formData.kategoriJasa.replace(/&/g, "dan"),
            tipePembayaran: formData.tipePembayaran,
            callbackUrl,
          }),
        });

        const paymentData = await paymentRes.json();

        if (!paymentRes.ok || !paymentData.payment_url) {
          throw new Error(
            paymentData.error ||
              paymentData.details ||
              "Gagal membuat sesi DOKU Checkout. Pastikan DOKU_CLIENT_ID & DOKU_SECRET_KEY telah diatur di .env.local."
          );
        }

        setDokuPaymentUrl(paymentData.payment_url);
        setStatus("idle");

        // Buka modal pop-up DOKU Checkout menggunakan SDK
        if (typeof window !== "undefined" && typeof window.loadJokulCheckout === "function") {
          window.loadJokulCheckout(paymentData.payment_url);
        } else {
          // Fallback redirect jika SDK belum siap atau diblokir pop-up blocker
          window.location.href = paymentData.payment_url;
        }
        return;
      }

      // ==========================================
      // ALUR 2: PEMBAYARAN MANUAL (TRANSFER / QRIS)
      // ==========================================
      const formDataToSend = new FormData();
      Object.entries(restData).forEach(([key, value]) => {
        formDataToSend.append(key, value as string);
      });
      // Sesuai opsi yang dipilih: jika user memilih DP tercatat "DP", jika memilih lunas tercatat "Lunas"
      formDataToSend.append("statusPembayaran", targetStatus);
      formDataToSend.append("statuspembayaran", targetStatus);
      formDataToSend.append("status_pembayaran", targetStatus);
      formDataToSend.append("payment_status", targetStatus);
      formDataToSend.append("tipePembayaran", targetStatus);
      formDataToSend.append("order_id", orderId);
      formDataToSend.append("Id-Order", orderId);
      formDataToSend.append("Id_order", orderId);

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
          : error instanceof Error
          ? error.message
          : "Booking gagal diproses. Silakan coba lagi."
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
      const tipePembayaran = prevTipe(formData.tipePembayaran);

      setKonflikTanggal("");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        baseHarga,
        tipePembayaran,
        harga: formatHarga(baseHarga, tipePembayaran),
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

  const prevTipe = (current: string) => current || "DP";

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

  const isUndangan = formData.kategoriJasa.toLowerCase().includes("undangan");

  if (status === "success" || isDokuSuccess) {
    const selectedDate = getSelectedDate();
    const tanggalTampil = selectedDate
      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
          selectedDate,
        )
      : formData.tanggalEvent || "Sesuai Jadwal Event";

    const displayClient = formData.namaClient || searchParams.get("name") || "Pelanggan";
    const displayService = formData.kategoriJasa || searchParams.get("service") || "Layanan Inferno";
    const displayOrderId = searchParams.get("order_id") || "BOOKING";

    const waText = searchParams.get("order_id")
      ? `Halo Inferno Creative, saya telah menyelesaikan pembayaran (*LUNAS*) atas nama *${displayClient}* untuk jasa *${displayService}* (Order ID: ${displayOrderId}). Mohon konfirmasi dan proses pesanan saya.`
      : `Halo Inferno Creative, saya baru saja melakukan booking atas nama *${formData.namaClient}* untuk jasa *${formData.kategoriJasa}*. Berikut adalah rincian pesanan saya.`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    return (
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl text-center"
        >
          <div className="flex justify-center mb-4 text-emerald-400">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Pembayaran Lunas & Booking Berhasil!
          </h1>
          <p className="text-white/70 mb-8">
            Terima kasih, {displayClient}. Pembayaran Anda telah terverifikasi dan tercatat di sistem kami sebagai <span className="text-emerald-400 font-bold">LUNAS</span>.
          </p>

          <dl className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-3 text-left">
            {[
              { label: "Nomor Order", value: displayOrderId },
              { label: "Kategori Jasa", value: displayService },
              { label: "Tanggal Event", value: tanggalTampil },
              { label: "Jam Event", value: formData.jamEvent || "-" },
              { label: "Lokasi", value: formData.lokasi || "-" },
              { label: "Status Pembayaran", value: "Lunas (Terverifikasi Otomatis)" },
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
            Data pesanan Anda telah tersinkronisasi otomatis dengan tim kami. Silakan hubungi kami via WhatsApp untuk proses pengerjaan atau pertanyaan lebih lanjut.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 text-lg"
          >
            <MessageCircle size={20} />
            <span>Konfirmasi Cepat via WhatsApp</span>
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
      {/* Script JS DOKU Checkout SDK */}
      <Script
        src={
          process.env.NEXT_PUBLIC_DOKU_IS_PRODUCTION === "true"
            ? "https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js"
            : "https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js"
        }
        strategy="afterInteractive"
      />

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
          {formStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium ml-1">Nama Client *</label>
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
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium ml-1">Nomor WhatsApp *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="081234567890"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium ml-1">Email *</label>
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
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium ml-1">Kategori Jasa *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                      <Camera size={20} />
                    </div>
                    <select
                      name="kategoriJasa"
                      value={formData.kategoriJasa}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 appearance-none outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer"
                      style={{ colorScheme: "dark" }}
                      required
                    >
                      {availableOptions.map((kategori) => (
                        <option key={kategori.value} value={kategori.value} className="text-gray-900">
                          {kategori.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.kategoriJasa.toLowerCase().includes("photobooth") && (
                    <p className="text-white/50 text-xs ml-1 flex items-start gap-1 mt-1">
                      <Info size={12} className="shrink-0 mt-0.5" />
                      Silakan klik kolom di atas untuk mengubah durasi jam photobooth.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium ml-1">Lokasi *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      name="lokasi"
                      placeholder="Ketik lokasi acara..."
                      value={formData.lokasi}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium ml-1">Tanggal Event *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 z-10 pointer-events-none">
                      <Calendar size={20} />
                    </div>
                    <DatePicker
                      selected={getSelectedDate()}
                      onChange={handleDateChange}
                      filterDate={(date) => !isDateDisabled(date)}
                      dayClassName={(date) => (isDateDisabled(date) ? "booking-day-penuh" : "")}
                      minDate={new Date()}
                      dateFormat="dd MMMM yyyy"
                      locale={id}
                      placeholderText={isLoadingBookings ? "Memuat kalender..." : "Pilih tanggal"}
                      disabled={isLoadingBookings}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30 cursor-pointer"
                      wrapperClassName="w-full"
                      required
                    />
                  </div>
                  {konflikTanggal && (
                    <p className="text-amber-300/90 text-xs ml-1 flex items-start gap-1 mt-1">
                      <AlertCircle size={12} className="shrink-0 mt-0.5" />
                      Tanggal sudah penuh untuk kategori ini. Silakan pilih tanggal lain.
                    </p>
                  )}
                  {!isLoadingBookings &&
                    (bookingsFailed ? (
                      <p className="text-amber-300/90 text-xs ml-1 flex items-start gap-1 mt-1">
                        <AlertCircle size={12} className="shrink-0 mt-0.5" />
                        Jadwal terisi gagal dimuat, jadi tanggal yang sudah penuh mungkin tidak tercoret. Kami akan konfirmasi ulang ketersediaannya.
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
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                      <Clock size={20} />
                    </div>
                    <input
                      type="time"
                      name="jamEvent"
                      value={formData.jamEvent}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all"
                      style={{ colorScheme: "dark" }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium ml-1">Keterangan Tambahan</label>
                <div className="relative">
                  <div className="absolute left-3 top-4 text-white/50">
                    <FileText size={20} />
                  </div>
                  <textarea
                    name="keterangan"
                    placeholder="Detail tambahan, request khusus, atau tema undangan..."
                    value={formData.keterangan}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-white/30 resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {formStep === 2 && (
            <div className="space-y-6">
              {/* Ringkasan Pesanan */}
              <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/15 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-600/20 text-red-400">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Ringkasan Pesanan</h3>
                      <p className="text-xs text-white/50">Pastikan detail pesanan Anda sudah benar</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-500/30">
                    Inferno Creative
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-white/60 shrink-0">Nama Pemesan</span>
                    <span className="text-white font-medium text-right">{formData.namaClient || "-"}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-white/60 shrink-0">Paket Layanan</span>
                    <div className="text-right">
                      <span className="text-white font-medium block">{formData.kategoriJasa}</span>
                      {formData.keterangan && formData.keterangan.startsWith("Paket dipilih:") && (
                        <span className="text-xs text-red-300/80 block mt-0.5">
                          {formData.keterangan.replace("Paket dipilih:", "").trim()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-white/60 shrink-0">Jadwal Event</span>
                    <span className="text-white font-medium text-right">
                      {formData.tanggalEvent
                        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
                            new Date(formData.tanggalEvent)
                          )
                        : "-"}
                      {formData.jamEvent ? ` • ${formData.jamEvent}` : ""}
                    </span>
                  </div>
                  {formData.lokasi && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-white/60 shrink-0">Lokasi Acara</span>
                      <span className="text-white/90 text-right text-xs max-w-[240px] truncate">{formData.lokasi}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-3">
                    <span className="text-white/80 font-medium">Total Nilai Paket</span>
                    <span className="text-lg font-bold text-white tracking-wide">{formData.baseHarga}</span>
                  </div>
                </div>
              </div>

              {/* Pilihan Skema Pembayaran */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-white/90 text-sm font-semibold">Pilih Skema Pembayaran</label>
                  <span className="text-xs text-white/50">Dapat disesuaikan</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DP 50% */}
                  <div
                    onClick={() =>
                      handleChange({ target: { name: "tipePembayaran", value: "DP" } } as any)
                    }
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      formData.tipePembayaran === "DP"
                        ? "border-red-500/80 bg-gradient-to-br from-red-950/40 via-red-900/10 to-transparent ring-1 ring-red-500/40 shadow-lg shadow-red-950/40"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-base">Uang Muka (DP 50%)</span>
                          {formData.tipePembayaran === "DP" && (
                            <span className="text-[10px] bg-red-600/30 text-red-300 font-semibold px-2 py-0.5 rounded-full border border-red-500/40">
                              Terpilih
                            </span>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.tipePembayaran === "DP"
                              ? "border-red-500 bg-red-600/20"
                              : "border-white/30"
                          }`}
                        >
                          {formData.tipePembayaran === "DP" && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        {formatHarga(formData.baseHarga, "DP")}
                      </p>
                    </div>
                    <p className="text-xs text-white/50 mt-3 leading-relaxed">
                      Kunci & amankan jadwal acara Anda. Sisa pelunasan diselesaikan sebelum hari pelaksanaan.
                    </p>
                  </div>

                  {/* Lunas 100% */}
                  <div
                    onClick={() =>
                      handleChange({ target: { name: "tipePembayaran", value: "Lunas" } } as any)
                    }
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      formData.tipePembayaran === "Lunas"
                        ? "border-red-500/80 bg-gradient-to-br from-red-950/40 via-red-900/10 to-transparent ring-1 ring-red-500/40 shadow-lg shadow-red-950/40"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-base">Bayar Penuh (Lunas)</span>
                          {formData.tipePembayaran === "Lunas" && (
                            <span className="text-[10px] bg-red-600/30 text-red-300 font-semibold px-2 py-0.5 rounded-full border border-red-500/40">
                              Terpilih
                            </span>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.tipePembayaran === "Lunas"
                              ? "border-red-500 bg-red-600/20"
                              : "border-white/30"
                          }`}
                        >
                          {formData.tipePembayaran === "Lunas" && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        {formData.baseHarga}
                      </p>
                    </div>
                    <p className="text-xs text-white/50 mt-3 leading-relaxed">
                      Satu kali transaksi praktis untuk kemudahan proses tanpa perlu memikirkan tagihan lanjutan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Metode Pembayaran - Minimalis & Elegan */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <CreditCard size={20} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Pembayaran Online</span>
                  <p className="text-xs text-white/50 mt-0.5">
                    Mendukung QRIS, Virtual Account, Kartu Kredit, & E-Wallet
                  </p>
                </div>
              </div>

              {/* Sesi popup aktif jika dibutuhkan */}
              {dokuPaymentUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-200 text-sm flex items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span>Jendela pembayaran aktif. Silakan selesaikan transaksi Anda.</span>
                  </div>
                  <a
                    href={dokuPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-medium inline-flex items-center gap-1.5 shrink-0 transition-all shadow-md"
                  >
                    <span>Buka Pembayaran</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
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
                className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-red-950/40 flex items-center justify-center gap-2 text-base md:text-lg cursor-pointer active:scale-[0.99]"
              >
                Lanjut ke Pembayaran
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 text-base md:text-lg cursor-pointer active:scale-[0.99]"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Menyiapkan Pembayaran...</span>
                  </>
                ) : (
                  <span>Bayar Sekarang • {formData.harga}</span>
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
