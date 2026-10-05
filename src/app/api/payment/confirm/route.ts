import { NextResponse } from "next/server";

const BOOKING_UPDATE_URL =
  "https://n8n.imadegautama.com/webhook/update-pembayaran-status";
const BOOKING_WEBHOOK_URL =
  "https://n8n.imadegautama.com/webhook/booking-inferno";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      namaClient,
      clientName,
      contact,
      phone,
      kategoriJasa,
      service,
      tanggalEvent,
      date,
      jamEvent,
      time,
      lokasi,
      location,
      harga,
      amount,
      email,
      keterangan,
      notes,
      status,
      statusPembayaran,
      tipePembayaran,
      metodePembayaran = "DOKU Checkout",
      buktiTransfer,
      webViewLink,
    } = body;

    const effectiveOrderId = orderId || body["Id-Order"] || body["Id_order"] || "";

    if (!effectiveOrderId) {
      return NextResponse.json(
        { error: "orderId atau Id-Order wajib diisi" },
        { status: 400 }
      );
    }

    const isDP =
      tipePembayaran === "DP" ||
      statusPembayaran === "DP" ||
      status === "DP" ||
      effectiveOrderId.includes("-DP-");

    const effectiveStatus = isDP ? "DP" : (statusPembayaran || status || "Lunas");
    const effectiveTipe = isDP ? "DP" : (tipePembayaran || "Lunas");
    const effectiveBukti = buktiTransfer || `DOKU Checkout (${effectiveStatus})`;
    const effectiveWebView = webViewLink || `DOKU Checkout (${effectiveStatus})`;

    const effectiveName = namaClient || clientName || "";
    const effectiveContact = contact || phone || "";
    const effectiveService = kategoriJasa || service || "";
    const effectiveTanggal = tanggalEvent || date || "";
    const effectiveJam = jamEvent || time || "";
    const effectiveLokasi = lokasi || location || "";
    const effectiveEmail = email || "";
    const effectiveKeterangan = keterangan || notes || "";
    const effectiveHarga =
      typeof harga === "number"
        ? `Rp ${harga.toLocaleString("id-ID")}`
        : harga ||
          (typeof amount === "number"
            ? `Rp ${amount.toLocaleString("id-ID")}`
            : amount || "");

    console.log("Confirming payment callback to n8n with exact mapped fields:", {
      namaClient: effectiveName,
      contact: effectiveContact,
      kategoriJasa: effectiveService,
      tanggalEvent: effectiveTanggal,
      jamEvent: effectiveJam,
      lokasi: effectiveLokasi,
      harga: effectiveHarga,
      email: effectiveEmail,
      statusPembayaran: effectiveStatus,
      keterangan: effectiveKeterangan,
      "Id-Order": effectiveOrderId,
    });

    // 1. Kirim update ke n8n webhook update-pembayaran-status (Webhook 3)
    const updateFormData = new FormData();
    // Data sesuai persis dengan pemetaan n8n di screenshot
    updateFormData.append("namaClient", effectiveName);
    updateFormData.append("contact", effectiveContact);
    updateFormData.append("kategoriJasa", effectiveService);
    updateFormData.append("tanggalEvent", effectiveTanggal);
    updateFormData.append("jamEvent", effectiveJam);
    updateFormData.append("lokasi", effectiveLokasi);
    updateFormData.append("harga", effectiveHarga);
    updateFormData.append("email", effectiveEmail);
    // n8n expression: {{ $('Webhook').first().json.body.statusPembayaran }}
    updateFormData.append("statusPembayaran", effectiveStatus);
    updateFormData.append("statuspembayaran", effectiveStatus);
    updateFormData.append("status_pembayaran", effectiveStatus);
    updateFormData.append("payment_status", effectiveStatus);
    updateFormData.append("keterangan", effectiveKeterangan);
    // n8n expression: {{ $json["Id-Order"] }} dan Id_order
    updateFormData.append("Id-Order", effectiveOrderId);
    updateFormData.append("Id_order", effectiveOrderId);
    updateFormData.append("order_id", effectiveOrderId);
    // Bukti transfer
    updateFormData.append("buktiTransfer", effectiveBukti);
    updateFormData.append("webViewLink", effectiveWebView);
    updateFormData.append("tipePembayaran", effectiveTipe);
    updateFormData.append("metodePembayaran", metodePembayaran);

    const updatePromise = fetch(BOOKING_UPDATE_URL, {
      method: "POST",
      body: updateFormData,
      signal: AbortSignal.timeout(10_000),
    }).catch((err) => {
      console.warn("Gagal update status n8n via BOOKING_UPDATE_URL:", err);
      return null;
    });

    // 2. Kirim update ke n8n webhook booking-inferno sebagai fallback
    const webhookFormData = new FormData();
    webhookFormData.append("namaClient", effectiveName);
    webhookFormData.append("contact", effectiveContact);
    webhookFormData.append("kategoriJasa", effectiveService);
    webhookFormData.append("tanggalEvent", effectiveTanggal);
    webhookFormData.append("jamEvent", effectiveJam);
    webhookFormData.append("lokasi", effectiveLokasi);
    webhookFormData.append("harga", effectiveHarga);
    webhookFormData.append("email", effectiveEmail);
    webhookFormData.append("statusPembayaran", effectiveStatus);
    webhookFormData.append("statuspembayaran", effectiveStatus);
    webhookFormData.append("status_pembayaran", effectiveStatus);
    webhookFormData.append("payment_status", effectiveStatus);
    webhookFormData.append("keterangan", effectiveKeterangan);
    webhookFormData.append("Id-Order", effectiveOrderId);
    webhookFormData.append("Id_order", effectiveOrderId);
    webhookFormData.append("order_id", effectiveOrderId);
    webhookFormData.append("buktiTransfer", effectiveBukti);
    webhookFormData.append("webViewLink", effectiveWebView);
    webhookFormData.append("tipePembayaran", effectiveTipe);
    webhookFormData.append("metodePembayaran", metodePembayaran);

    const webhookPromise = fetch(BOOKING_WEBHOOK_URL, {
      method: "POST",
      body: webhookFormData,
      signal: AbortSignal.timeout(10_000),
    }).catch((err) => {
      console.warn("Gagal update status n8n via BOOKING_WEBHOOK_URL:", err);
      return null;
    });

    await Promise.allSettled([updatePromise, webhookPromise]);

    return NextResponse.json({
      success: true,
      message: `Data order ${effectiveOrderId} berhasil disinkronkan ke n8n dengan status ${effectiveStatus}.`,
    });
  } catch (error: any) {
    console.error("Error confirming payment to n8n:", error);
    return NextResponse.json(
      { error: error.message || "Gagal sinkronisasi data ke n8n" },
      { status: 500 }
    );
  }
}
