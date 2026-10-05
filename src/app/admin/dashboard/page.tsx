"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  LogOut,
  Edit,
  Save,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KATEGORI_BOOKING, resolveKategori } from "@/lib/kuotaBooking";

const BOOKING_LIST_URL = "https://n8n.imadegautama.com/webhook/databooking";
// Ganti URL webhook ini dengan link dari n8n untuk update data (Webhook 3)
const BOOKING_UPDATE_URL = "https://n8n.imadegautama.com/webhook/update-pembayaran-status";

// Sesuaikan interface ini dengan format data JSON balasan webhook n8n
interface SheetRow {
  "TanggalEvent "?: string;
  TanggalEvent?: string;
  KategoriJasa?: string;
  namaClient?: string;
  contact?: string;
  harga?: string;
  tipePembayaran?: string;
  metodePembayaran?: string;
  status_pembayaran?: string;
  order_id?: string;
  [key: string]: any; // Allow other fields
}

function formatWaNumber(phone: string | number): string {
  const clean = String(phone).replace(/\D/g, "");
  if (!clean) return "";
  if (clean.startsWith("62")) return clean;
  if (clean.startsWith("0")) return "62" + clean.slice(1);
  if (clean.startsWith("8")) return "62" + clean;
  return clean;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<SheetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingRow, setUpdatingRow] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status_pembayaran: string; harga: string }>({
    status_pembayaran: "",
    harga: "",
  });

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(BOOKING_LIST_URL);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Format data tidak valid, diharapkan array.");
      }
      // Map response dari webhook n8n Google Sheets ke object SheetRow yang konsisten
      const mappedData = data
        .filter((item: any) => {
          // Hanya tampilkan jika baris memiliki data (tidak kosong semua)
          const name = String(item["Nama Client"] ?? item.namaClient ?? "").trim();
          const service = String(item["KategoriJasa"] ?? item.kategoriJasa ?? "").trim();
          const order = String(item["Id_order"] ?? item["Id-Order"] ?? item.order_id ?? "").trim();
          const tgl = String(item["TanggalEvent "] ?? item["TanggalEvent"] ?? item.tanggalEvent ?? "").trim();
          return name !== "" || service !== "" || order !== "" || tgl !== "";
        })
        .map((item: any, index: number) => {
          const rowNumber = Number(item.row_number) || index + 2;
          const orderId = String(item["Id_order"] ?? item["Id-Order"] ?? item.order_id ?? "").trim();
          const namaClient = String(item["Nama Client"] ?? item.namaClient ?? "").trim();
          const contact = String(item["Contact"] ?? item.contact ?? "").trim();
          const kategoriJasa = String(item["KategoriJasa"] ?? item.kategoriJasa ?? "").trim();
          const tanggalEvent = String(item["TanggalEvent "] ?? item["TanggalEvent"] ?? item.tanggalEvent ?? "").trim();
          const jamEvent = String(item["JamEvent "] ?? item["JamEvent"] ?? item.jamEvent ?? "").trim();
          const lokasi = String(item["lokasi"] ?? item.lokasi ?? item.Lokasi ?? "").trim();
          const harga = String(item["harga"] ?? item["Harga"] ?? item.harga ?? "").trim();
          const email = String(item["Email"] ?? item.email ?? "").trim();
          const rawStatus = String(item["statuspembayaran"] ?? item["statusPembayaran"] ?? item.status_pembayaran ?? "").trim();
          const keterangan = String(item["keterangan"] ?? item.keterangan ?? "").trim();
          const buktiTransfer = String(item["Bukti Transfer"] ?? item["buktiTransfer"] ?? item.buktiTransfer ?? "").trim();

          // Normalisasi status pembayaran: jika "Lunas" / "DP" / kosong ("Menunggu Konfirmasi")
          let status_pembayaran = "Menunggu Konfirmasi";
          const s = rawStatus.toLowerCase();
          if (s === "lunas" || s.includes("lunas")) {
            status_pembayaran = "Lunas";
          } else if (s === "dp" || s.includes("dp")) {
            status_pembayaran = "DP";
          } else if (rawStatus) {
            status_pembayaran = rawStatus;
          }

          // Tipe pembayaran
          let tipePembayaran = String(item["Tipe Pembayaran"] ?? item.tipePembayaran ?? "").trim();
          if (!tipePembayaran) {
            if (status_pembayaran === "DP" || orderId.includes("-DP-")) {
              tipePembayaran = "DP (50%)";
            } else if (status_pembayaran === "Lunas" || orderId.includes("-LUNAS-")) {
              tipePembayaran = "Lunas (100%)";
            } else {
              tipePembayaran = "-";
            }
          }

          // Metode pembayaran
          let metodePembayaran = String(item["metodePembayaran"] ?? item["Metode Pembayaran"] ?? "").trim();
          if (!metodePembayaran) {
            if (buktiTransfer.toLowerCase().includes("doku")) {
              metodePembayaran = "DOKU Checkout";
            } else if (buktiTransfer.startsWith("http")) {
              metodePembayaran = "Transfer / Bukti Upload";
            } else {
              metodePembayaran = orderId ? "DOKU Checkout" : "Manual";
            }
          }

          return {
            ...item,
            row_number: rowNumber,
            order_id: orderId,
            "Id_order": orderId,
            "Id-Order": orderId,
            namaClient,
            contact,
            kategoriJasa,
            KategoriJasa: kategoriJasa,
            tanggalEvent,
            "TanggalEvent ": tanggalEvent,
            TanggalEvent: tanggalEvent,
            jamEvent,
            "JamEvent ": jamEvent,
            JamEvent: jamEvent,
            lokasi,
            harga,
            email,
            status_pembayaran,
            statuspembayaran: status_pembayaran,
            statusPembayaran: status_pembayaran,
            tipePembayaran,
            metodePembayaran,
            keterangan,
            buktiTransfer,
            "Bukti Transfer": buktiTransfer,
          };
        });
      // Kita membalik data agar yang terbaru (di bawah spreadsheet) tampil di atas
      setBookings(mappedData.reverse());
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = async (clientName: string, tanggalEvent: string, orderId: string, rowIndex: number) => {
    if (!editForm.status_pembayaran) return;
    setUpdatingRow(orderId || rowIndex.toString());

    try {
      const formData = new FormData();
      // Mengirim Id-Order persis sesuai node webhook n8n: {{ $json.body.Id-Order }}
      formData.append("Id-Order", orderId || "");
      formData.append("Id_order", orderId || "");
      formData.append("order_id", orderId || "");
      formData.append("namaClient", clientName || "");
      formData.append("tanggalEvent", tanggalEvent || "");
      formData.append("statusPembayaran", editForm.status_pembayaran);
      formData.append("statuspembayaran", editForm.status_pembayaran);
      formData.append("status_pembayaran", editForm.status_pembayaran);
      formData.append("payment_status", editForm.status_pembayaran);
      formData.append("tipePembayaran", editForm.status_pembayaran);
      formData.append("harga", editForm.harga);

      const response = await fetch(BOOKING_UPDATE_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`HTTP ${response.status}: ${txt}`);
      }

      // Update data di tabel secara lokal agar tidak perlu reload
      setBookings(prev => prev.map((item, idx) => {
        if ((orderId && item.order_id === orderId) || idx === rowIndex) {
          return {
            ...item,
            status_pembayaran: editForm.status_pembayaran,
            harga: editForm.harga,
          };
        }
        return item;
      }));

      setEditingRow(null);
    } catch (err: any) {
      alert("Gagal mengupdate data. Error: " + err.message);
      console.error(err);
    } finally {
      setUpdatingRow(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    let text = status || "Menunggu Konfirmasi";
    let dotColor = "bg-red-600";
    if (s.includes("lunas") || s === "success") {
      text = "Lunas";
      dotColor = "bg-emerald-400";
    } else if (s.includes("dp")) {
      text = "DP";
      dotColor = "bg-amber-400";
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-transparent border border-white/20 text-white/90 rounded-full text-xs font-medium">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        {text}
      </span>
    );
  };

  const filteredBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    return (
      (b.namaClient || "").toLowerCase().includes(term) ||
      (b.KategoriJasa || "").toLowerCase().includes(term) ||
      (b.order_id || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans relative overflow-hidden p-4 md:p-8 pt-24">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-800/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="bg-red-600 w-2 h-8 rounded-full inline-block"></span>
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-1">Kelola data pemesanan dan pembayaran Inferno Creative</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors border border-white/20"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={() => {
                document.cookie = "admin_token=; path=/; max-age=0";
                window.location.href = "/admin";
              }}
              className="flex items-center gap-2 bg-black/50 hover:bg-black px-4 py-2 rounded-xl transition-colors border border-red-500/20"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
            <input
              type="text"
              placeholder="Cari nama, jasa, atau order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white/90 placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 text-white/60 text-sm border-b border-white/10 backdrop-blur-xl">
                  <th className="p-4 font-medium">Order Info</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Event & Jasa</th>
                  <th className="p-4 font-medium">Harga / Tipe</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/60">
                      <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                      Memuat data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-red-400">
                      <AlertCircle className="mx-auto mb-2" size={24} />
                      {error}
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/60">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((row, index) => {
                    const tgl = (row["TanggalEvent "] ?? row.TanggalEvent ?? "-").trim();
                    const isEditing = editingRow === (row.order_id || index.toString());
                    const isUpdating = updatingRow === (row.order_id || index.toString());

                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                        key={row.order_id || index}
                        className="hover:bg-red-500/5 transition-colors"
                      >
                        <td className="p-4 align-top">
                          <p className="text-xs font-mono text-white/40 mb-1">{row.order_id || `ROW-${row.row_number || index + 1}`}</p>
                          <p className="text-sm">{row.metodePembayaran || "-"}</p>
                          {row.buktiTransfer && row.buktiTransfer.startsWith("http") && (
                            <a
                              href={row.buktiTransfer}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 mt-1 transition-colors underline"
                            >
                              <ExternalLink size={11} />
                              <span>Lihat Bukti</span>
                            </a>
                          )}
                        </td>
                        <td className="p-4 align-top">
                          <p className="font-medium text-white/90">{row.namaClient || "-"}</p>
                          <p className="text-sm text-white/60">{row.contact || "-"}</p>
                        </td>
                        <td className="p-4 align-top">
                          <p className="font-medium text-red-400">{row.KategoriJasa || "-"}</p>
                          <p className="text-sm text-white/60">{tgl}</p>
                        </td>
                        <td className="p-4 align-top">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.harga}
                              onChange={(e) => setEditForm({ ...editForm, harga: e.target.value })}
                              className="bg-white/5 border border-white/20 rounded px-2 py-1 text-sm w-full max-w-[120px]"
                              placeholder="Rp 0"
                            />
                          ) : (
                            <p className="font-medium text-white/90">{row.harga || "-"}</p>
                          )}
                          <p className="text-xs text-white/60 mt-1">{row.tipePembayaran || "-"}</p>
                        </td>
                        <td className="p-4 align-top">
                          {isEditing ? (
                            <select
                              value={editForm.status_pembayaran}
                              onChange={(e) => {
                                const val = e.target.value;
                                let newHarga = editForm.harga;

                                const isOriginallyDP = (row.tipePembayaran || "").toUpperCase().includes("DP");
                                const originalNumeric = parseInt((row.harga || "0").replace(/\D/g, ""));

                                if (!isNaN(originalNumeric) && originalNumeric > 0) {
                                  const baseFullPrice = isOriginallyDP ? originalNumeric * 2 : originalNumeric;
                                  if (val === "Lunas") {
                                    newHarga = "Rp " + new Intl.NumberFormat("id-ID").format(baseFullPrice);
                                  } else if (val.includes("DP")) {
                                    newHarga = "Rp " + new Intl.NumberFormat("id-ID").format(baseFullPrice / 2);
                                  } else {
                                    newHarga = row.harga || "";
                                  }
                                }
                                
                                setEditForm({ ...editForm, status_pembayaran: val, harga: newHarga });
                              }}
                              className="bg-black border border-white/20 rounded px-2 py-1 text-sm w-full min-w-[140px] text-white"
                            >
                              <option className="bg-black text-white" value="DP">DP</option>
                              <option className="bg-black text-white" value="Lunas">Lunas</option>
                              <option className="bg-black text-white" value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                            </select>
                          ) : (
                            getStatusBadge(row.status_pembayaran)
                          )}
                        </td>
                        <td className="p-4 align-top text-right space-y-2">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(row.namaClient || "", tgl, row.order_id || "", index)}
                                  disabled={isUpdating}
                                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                  title="Simpan"
                                >
                                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                </button>
                                <button
                                  onClick={() => setEditingRow(null)}
                                  disabled={isUpdating}
                                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                  title="Batal"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingRow(row.order_id || index.toString());
                                    setEditForm({
                                      status_pembayaran: row.status_pembayaran || "Menunggu Konfirmasi",
                                      harga: row.harga || "",
                                    });
                                  }}
                                  className="p-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg transition-colors flex items-center justify-center"
                                  title="Edit Status & Harga"
                                >
                                  <Edit size={16} />
                                </button>
                                {row.contact && formatWaNumber(row.contact) && (
                                  <a
                                    href={`https://wa.me/${formatWaNumber(row.contact)}?text=Halo%20${encodeURIComponent(row.namaClient || '')},%20kami%20dari%20Inferno%20Creative%20ingin%20mengkonfirmasi%20pembayaran%20booking%20Anda.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-lg transition-colors flex items-center justify-center"
                                    title="Hubungi WhatsApp"
                                  >
                                    <MessageCircle size={16} />
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
