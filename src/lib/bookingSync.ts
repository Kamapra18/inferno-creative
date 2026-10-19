export const BOOKING_LIST_URL = "https://n8n.imadegautama.com/webhook/databooking";
export const BOOKING_UPDATE_URL = "https://n8n.imadegautama.com/webhook/update-pembayaran-status";
export const BOOKING_WEBHOOK_URL = "https://n8n.imadegautama.com/webhook/booking-inferno";

export interface BookingRow {
  row_number?: number;
  "Nama Client"?: string;
  namaClient?: string;
  Contact?: string | number;
  contact?: string | number;
  KategoriJasa?: string;
  kategoriJasa?: string;
  "TanggalEvent "?: string;
  TanggalEvent?: string;
  tanggalEvent?: string;
  "JamEvent "?: string;
  JamEvent?: string;
  jamEvent?: string;
  lokasi?: string;
  harga?: string;
  Email?: string;
  email?: string;
  statuspembayaran?: string;
  statusPembayaran?: string;
  keterangan?: string;
  "Bukti Transfer"?: string;
  Id_order?: string;
  "Id-Order"?: string;
  order_id?: string;
  [key: string]: any;
}

export async function fetchBookingRows(signal?: AbortSignal): Promise<BookingRow[]> {
  try {
    const res = await fetch(BOOKING_LIST_URL, {
      signal: signal || AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("fetchBookingRows failed:", err);
    return [];
  }
}

export async function resolveBookingRow(criteria: {
  orderId?: string;
  namaClient?: string;
  tanggalEvent?: string;
  email?: string;
  contact?: string;
}): Promise<BookingRow | null> {
  const rows = await fetchBookingRows();
  if (!rows || rows.length === 0) return null;

  const rawOrderId = (criteria.orderId || "").trim();
  const binfMatch = rawOrderId.match(/BINF-\d+-\d+/i);
  const cleanBinfId = binfMatch ? binfMatch[0].toUpperCase() : "";

  const targetName = (criteria.namaClient || "").trim().toLowerCase();
  const targetDate = (criteria.tanggalEvent || "").trim();
  const targetEmail = (criteria.email || "").trim().toLowerCase();
  const cleanContact = String(criteria.contact || "").replace(/\D/g, "");

  // Iterasi dari belakang (data terbaru terlebih dahulu)
  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i];
    const rId = String(r.Id_order || r["Id-Order"] || r.order_id || "").trim();
    const rName = String(r["Nama Client"] || r.namaClient || "").trim().toLowerCase();
    const rDate = String(r["TanggalEvent "] || r.TanggalEvent || r.tanggalEvent || "").trim();
    const rEmail = String(r.Email || r.email || "").trim().toLowerCase();
    const rContact = String(r.Contact || r.contact || "").replace(/\D/g, "");

    // 1. Cocokkan ID BINF jika terdeteksi
    if (cleanBinfId && rId.toUpperCase() === cleanBinfId) {
      return r;
    }
    // 2. Cocokkan persis orderId
    if (rawOrderId && rId === rawOrderId) {
      return r;
    }
    // 3. Cocokkan nama client dan tanggal event
    if (targetName && targetDate && rName === targetName && rDate === targetDate) {
      return r;
    }
    // 4. Cocokkan email dan tanggal event
    if (targetEmail && targetDate && rEmail === targetEmail && rDate === targetDate) {
      return r;
    }
    // 5. Cocokkan nomor kontak dan tanggal event
    if (cleanContact && targetDate && rContact && cleanContact.endsWith(rContact.slice(-8)) && rDate === targetDate) {
      return r;
    }
    // 6. Cocokkan email saja (jika bukan email default/placeholder)
    if (targetEmail && targetEmail !== "customer@inferno-production.com" && rEmail === targetEmail) {
      return r;
    }
    // 7. Cocokkan nama client saja (pilih baris paling baru)
    if (targetName && rName === targetName) {
      return r;
    }
  }

  return null;
}

export async function syncBookingPaymentStatus(params: {
  orderId?: string;
  statusPembayaran: "DP" | "Lunas" | string;
  namaClient?: string;
  contact?: string;
  kategoriJasa?: string;
  tanggalEvent?: string;
  jamEvent?: string;
  lokasi?: string;
  harga?: string;
  email?: string;
  keterangan?: string;
  metodePembayaran?: string;
  buktiTransfer?: string;
  webViewLink?: string;
  channel?: string;
}): Promise<{ success: boolean; resolvedOrderId: string; message: string }> {
  // 1. Dapatkan baris pesanan sebenarnya di Google Sheets melalui n8n
  const matched = await resolveBookingRow({
    orderId: params.orderId,
    namaClient: params.namaClient,
    tanggalEvent: params.tanggalEvent,
    email: params.email,
    contact: params.contact,
  });

  const rawOrderId = (params.orderId || "").trim();
  const binfMatch = rawOrderId.match(/BINF-\d+-\d+/i);
  const resolvedOrderId =
    matched?.Id_order ||
    matched?.["Id-Order"] ||
    (binfMatch ? binfMatch[0].toUpperCase() : rawOrderId);

  // 2. Tentukan status pembayaran akhir (DP atau Lunas)
  const isDP =
    params.statusPembayaran === "DP" ||
    rawOrderId.toUpperCase().includes("-DP") ||
    rawOrderId.toUpperCase().includes("DP");
  const targetStatus = isDP ? "DP" : (params.statusPembayaran || "Lunas");

  const effectiveName = params.namaClient || matched?.["Nama Client"] || matched?.namaClient || "";
  const effectiveContact = params.contact || matched?.Contact || matched?.contact || "";
  const effectiveService = params.kategoriJasa || matched?.KategoriJasa || matched?.kategoriJasa || "";
  const effectiveTanggal = params.tanggalEvent || matched?.["TanggalEvent "] || matched?.TanggalEvent || matched?.tanggalEvent || "";
  const effectiveJam = params.jamEvent || matched?.["JamEvent "] || matched?.JamEvent || matched?.jamEvent || "";
  const effectiveLokasi = params.lokasi || matched?.lokasi || matched?.Lokasi || "";
  const effectiveHarga = params.harga || matched?.harga || matched?.Harga || "";
  const effectiveEmail = params.email || matched?.Email || matched?.email || "";
  const effectiveKeterangan = params.keterangan || matched?.keterangan || "";
  const effectiveMetode = params.metodePembayaran || (params.channel ? `DOKU Checkout (${params.channel})` : "DOKU Checkout");
  const effectiveBukti = params.buktiTransfer || `DOKU Checkout (${targetStatus})`;
  const effectiveWebView = params.webViewLink || `DOKU Checkout (${targetStatus})`;

  const formData = new FormData();
  // Kunci pencarian baris Google Sheets di n8n: Id-Order dan Id_order
  formData.append("Id-Order", resolvedOrderId);
  formData.append("Id_order", resolvedOrderId);
  formData.append("order_id", resolvedOrderId);
  // Nilai status pembayaran baru
  formData.append("statusPembayaran", targetStatus);
  formData.append("statuspembayaran", targetStatus);
  formData.append("status_pembayaran", targetStatus);
  formData.append("payment_status", targetStatus);
  formData.append("tipePembayaran", targetStatus);
  // Sertakan kembali data baris agar kolom lain tidak kosong saat di-update oleh node n8n
  if (effectiveName) formData.append("namaClient", effectiveName);
  if (effectiveContact) formData.append("contact", String(effectiveContact));
  if (effectiveService) formData.append("kategoriJasa", effectiveService);
  if (effectiveTanggal) formData.append("tanggalEvent", effectiveTanggal);
  if (effectiveJam) formData.append("jamEvent", effectiveJam);
  if (effectiveLokasi) formData.append("lokasi", effectiveLokasi);
  if (effectiveHarga) formData.append("harga", effectiveHarga);
  if (effectiveEmail) formData.append("email", effectiveEmail);
  if (effectiveKeterangan) formData.append("keterangan", effectiveKeterangan);
  formData.append("buktiTransfer", effectiveBukti);
  formData.append("webViewLink", effectiveWebView);
  formData.append("metodePembayaran", effectiveMetode);

  console.log("Mengirim sinkronisasi status pembayaran ke n8n:", {
    resolvedOrderId,
    targetStatus,
    effectiveName,
    effectiveTanggal,
    effectiveHarga,
  });

  try {
    const res = await fetch(BOOKING_UPDATE_URL, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(15_000),
    });

    if (res.ok) {
      return {
        success: true,
        resolvedOrderId,
        message: `Status pesanan ${resolvedOrderId} berhasil diperbarui menjadi ${targetStatus}`,
      };
    }

    const text = await res.text();
    console.warn("BOOKING_UPDATE_URL response not ok:", res.status, text);
    return {
      success: false,
      resolvedOrderId,
      message: `Update returned status ${res.status}: ${text}`,
    };
  } catch (err: any) {
    console.error("Error calling BOOKING_UPDATE_URL:", err);
    return {
      success: false,
      resolvedOrderId,
      message: err.message || "Gagal menghubungi webhook update n8n",
    };
  }
}
