"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "6285645150857";

export default function BookingSuccessPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "BOOKING";
  const [hasSynced, setHasSynced] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  // Otomatis ambil data pesanan dan sinkronkan seluruh field ke n8n
  useEffect(() => {
    let cachedData: any = {};
    try {
      const raw =
        sessionStorage.getItem("inferno_order_" + orderId) ||
        localStorage.getItem("inferno_order_" + orderId);
      if (raw) {
        cachedData = JSON.parse(raw);
        setOrderInfo(cachedData);
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }

    if (orderId && !hasSynced) {
      setHasSynced(true);
      const isDPOrder =
        orderId.includes("-DP-") ||
        cachedData.tipePembayaran === "DP" ||
        cachedData.statusPembayaran === "DP";
      const targetStatusToSend = isDPOrder ? "DP" : "Lunas";

      fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          "Id-Order": orderId,
          Id_order: orderId,
          namaClient: cachedData.namaClient || "",
          contact: cachedData.contact || "",
          kategoriJasa: cachedData.kategoriJasa || "",
          tanggalEvent: cachedData.tanggalEvent || "",
          jamEvent: cachedData.jamEvent || "",
          lokasi: cachedData.lokasi || "",
          harga: cachedData.harga || "",
          email: cachedData.email || "",
          keterangan: cachedData.keterangan || "",
          statusPembayaran: targetStatusToSend, // Sesuai opsi: "DP" jika pilih DP, "Lunas" jika pilih Lunas
          statuspembayaran: targetStatusToSend,
          status: targetStatusToSend,
          buktiTransfer: `DOKU Checkout (${targetStatusToSend})`,
          webViewLink: `DOKU Checkout (${targetStatusToSend})`,
          tipePembayaran: targetStatusToSend,
          metodePembayaran: "DOKU Checkout",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(`n8n payment status confirmed as ${targetStatusToSend}:`, data);
        })
        .catch((err) => {
          console.warn("Error confirming status to n8n:", err);
        });
    }
  }, [orderId, hasSynced]);

  const isDP =
    orderId.includes("-DP-") ||
    orderInfo?.tipePembayaran === "DP" ||
    orderInfo?.statusPembayaran === "DP";
  const targetStatus = isDP ? "DP" : "Lunas";
  const displayStatus = isDP ? "DP (50%)" : "Lunas";

  const clientName = orderInfo?.namaClient || "Pelanggan";
  const serviceName = orderInfo?.kategoriJasa || "Layanan Inferno";

  const waText = `Halo Inferno Creative, saya telah menyelesaikan pembayaran (*${targetStatus}*) atas nama *${clientName}* untuk *${serviceName}* (Order ID: ${orderId}). Mohon konfirmasi dan proses pesanan saya.`;
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <div
      className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center"
      style={{ background: "var(--color-background)" }}
    >
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-3xl shadow-2xl text-center"
        >
          <div className="flex justify-center mb-4 text-emerald-400">
            <CheckCircle2 size={68} strokeWidth={1.5} />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full mb-3">
            <ShieldCheck size={14} />
            <span>Terverifikasi Otomatis</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Pembayaran {targetStatus} & Booking Berhasil!
          </h1>
          <p className="text-white/70 mb-8">
            Terima kasih, {clientName}. Pembayaran Anda telah kami terima dan tercatat otomatis di sistem kami sebagai <span className="text-emerald-400 font-bold">{targetStatus}</span>.
          </p>

          <dl className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 space-y-3 text-left">
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-white/50 shrink-0">Nomor Order</dt>
              <dd className="text-white font-mono font-medium text-right">{orderId}</dd>
            </div>
            {orderInfo?.namaClient && (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-white/50 shrink-0">Nama Client</dt>
                <dd className="text-white font-medium text-right">{orderInfo.namaClient}</dd>
              </div>
            )}
            {orderInfo?.kategoriJasa && (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-white/50 shrink-0">Kategori Jasa</dt>
                <dd className="text-white font-medium text-right">{orderInfo.kategoriJasa}</dd>
              </div>
            )}
            {orderInfo?.tanggalEvent && (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-white/50 shrink-0">Tanggal Event</dt>
                <dd className="text-white font-medium text-right">{orderInfo.tanggalEvent}</dd>
              </div>
            )}
            {orderInfo?.harga && (
              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-white/50 shrink-0">Total Harga</dt>
                <dd className="text-white font-bold text-right text-emerald-400">{orderInfo.harga}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-white/50 shrink-0">Metode Pembayaran</dt>
              <dd className="text-white font-medium text-right">Online Payment (Otomatis)</dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-white/50 shrink-0">Status Pembayaran</dt>
              <dd className="text-emerald-400 font-bold text-right flex items-center justify-end gap-1">
                <Sparkles size={14} />
                <span>{displayStatus} (Terverifikasi Otomatis)</span>
              </dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-white/50 shrink-0">Status Pengerjaan</dt>
              <dd className="text-white/80 font-medium text-right">Siap Diproses Tim Inferno</dd>
            </div>
          </dl>

          <p className="text-white/70 text-sm mb-5">
            Pesanan Anda segera kami tangani. Anda dapat langsung terhubung dengan tim kami via WhatsApp di bawah untuk konfirmasi pengerjaan.
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
    </div>
  );
}
