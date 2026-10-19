import { NextResponse } from "next/server";
import { syncBookingPaymentStatus } from "@/lib/bookingSync";

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

    const isDP =
      tipePembayaran === "DP" ||
      statusPembayaran === "DP" ||
      status === "DP" ||
      effectiveOrderId.toUpperCase().includes("-DP");

    const effectiveStatus = isDP ? "DP" : (statusPembayaran || status || "Lunas");

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

    const syncResult = await syncBookingPaymentStatus({
      orderId: effectiveOrderId,
      statusPembayaran: effectiveStatus,
      namaClient: effectiveName,
      contact: effectiveContact,
      kategoriJasa: effectiveService,
      tanggalEvent: effectiveTanggal,
      jamEvent: effectiveJam,
      lokasi: effectiveLokasi,
      harga: effectiveHarga,
      email: effectiveEmail,
      keterangan: effectiveKeterangan,
      metodePembayaran,
      buktiTransfer,
      webViewLink,
    });

    return NextResponse.json({
      success: syncResult.success,
      message: syncResult.message,
      resolvedOrderId: syncResult.resolvedOrderId,
    });
  } catch (error: any) {
    console.error("Error confirming payment to n8n:", error);
    return NextResponse.json(
      { error: error.message || "Gagal sinkronisasi data ke n8n" },
      { status: 500 }
    );
  }
}

