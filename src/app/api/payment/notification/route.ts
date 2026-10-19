import { NextResponse } from "next/server";
import { verifyDokuSignature } from "@/lib/doku";
import { syncBookingPaymentStatus } from "@/lib/bookingSync";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let body: any = {};
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const clientId = request.headers.get("client-id") || "";
    const requestId = request.headers.get("request-id") || "";
    const requestTimestamp = request.headers.get("request-timestamp") || "";
    const incomingSignature = request.headers.get("signature") || "";
    const secretKey = process.env.DOKU_SECRET_KEY?.trim() || "";

    // Target path endpoint sesuai url notifikasi yang didaftarkan di DOKU
    const requestTarget = "/api/payment/notification";

    // Validasi Signature jika secret key tersedia
    if (secretKey) {
      const isValid = verifyDokuSignature({
        clientId,
        requestId,
        requestTimestamp,
        requestTarget,
        rawBody,
        incomingSignature,
        secretKey,
      });

      if (!isValid) {
        console.warn("DOKU notification signature verification failed", {
          clientId,
          requestId,
          incomingSignature,
        });
      }
    }

    const orderId = body?.order?.invoice_number;
    const transactionStatus =
      body?.transaction?.status || body?.order?.status || "UNKNOWN";
    const amount = body?.order?.amount;
    const channel = body?.transaction?.channel || "DOKU Checkout";

    console.log("DOKU Webhook Notification Received:", {
      orderId,
      transactionStatus,
      amount,
      channel,
    });

    // Jika pembayaran sukses, update status ke n8n sesuai pilihan (DP atau Lunas)
    if (transactionStatus === "SUCCESS" && orderId) {
      const isDP =
        orderId.toUpperCase().includes("-DP") ||
        orderId.toUpperCase().includes("DP");
      const targetStatus = isDP ? "DP" : "Lunas";
      const formattedHarga = amount
        ? `Rp ${Number(amount).toLocaleString("id-ID")}`
        : "";

      const customerName =
        body?.customer?.name ||
        body?.order?.customer_name ||
        "";
      const customerEmail =
        body?.customer?.email ||
        body?.order?.customer_email ||
        "";

      await syncBookingPaymentStatus({
        orderId,
        statusPembayaran: targetStatus,
        namaClient: customerName,
        email: customerEmail,
        harga: formattedHarga,
        channel,
        metodePembayaran: `DOKU Checkout (${channel})`,
      });
    }

    // DOKU mengharapkan respon 200 OK dengan format JSON
    return NextResponse.json({
      status: "SUCCESS",
      message: "DOKU notification received and synced successfully",
    });
  } catch (error: any) {
    console.error("Error processing DOKU notification:", error);
    return NextResponse.json(
      { status: "ERROR", message: error.message },
      { status: 500 }
    );
  }
}

