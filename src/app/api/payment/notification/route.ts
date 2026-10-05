import { NextResponse } from "next/server";
import { verifyDokuSignature } from "@/lib/doku";

const BOOKING_UPDATE_URL =
  "https://n8n.imadegautama.com/webhook/update-pembayaran-status";
const BOOKING_WEBHOOK_URL =
  "https://n8n.imadegautama.com/webhook/booking-inferno";

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
      const isDP = orderId.includes("-DP-");
      const targetStatus = isDP ? "DP" : "Lunas";
      const formattedHarga = amount
        ? `Rp ${Number(amount).toLocaleString("id-ID")}`
        : "";

      // 1. Kirim update ke n8n webhook update-pembayaran-status (Webhook 3)
      try {
        const updateFormData = new FormData();
        // n8n property matches: Id-Order, Id_order, order_id
        updateFormData.append("Id-Order", orderId);
        updateFormData.append("Id_order", orderId);
        updateFormData.append("order_id", orderId);
        // n8n property matches: {{ $('Webhook').first().json.body.statusPembayaran }}
        updateFormData.append("statusPembayaran", targetStatus);
        updateFormData.append("statuspembayaran", targetStatus);
        updateFormData.append("status_pembayaran", targetStatus);
        updateFormData.append("payment_status", targetStatus);
        updateFormData.append("tipePembayaran", targetStatus);
        updateFormData.append("channel", channel);
        updateFormData.append("metodePembayaran", `DOKU Checkout (${channel})`);
        updateFormData.append("buktiTransfer", `DOKU Checkout (${channel} - ${targetStatus})`);
        updateFormData.append("webViewLink", `DOKU Checkout (${channel} - ${targetStatus})`);
        if (formattedHarga) {
          updateFormData.append("harga", formattedHarga);
        }

        await fetch(BOOKING_UPDATE_URL, {
          method: "POST",
          body: updateFormData,
          signal: AbortSignal.timeout(10_000),
        }).catch((err) => {
          console.error("Gagal update status n8n via BOOKING_UPDATE_URL:", err);
        });
      } catch (err) {
        console.error("Error sending update to n8n BOOKING_UPDATE_URL:", err);
      }

      // 2. Kirim update ke n8n webhook booking-inferno sebagai fallback
      try {
        const webhookFormData = new FormData();
        webhookFormData.append("Id-Order", orderId);
        webhookFormData.append("Id_order", orderId);
        webhookFormData.append("order_id", orderId);
        webhookFormData.append("statusPembayaran", targetStatus);
        webhookFormData.append("statuspembayaran", targetStatus);
        webhookFormData.append("status_pembayaran", targetStatus);
        webhookFormData.append("payment_status", targetStatus);
        webhookFormData.append("tipePembayaran", targetStatus);
        webhookFormData.append("channel", channel);
        webhookFormData.append("metodePembayaran", `DOKU Checkout (${channel})`);
        webhookFormData.append("buktiTransfer", `DOKU Checkout (${channel} - ${targetStatus})`);
        webhookFormData.append("webViewLink", `DOKU Checkout (${channel} - ${targetStatus})`);
        if (formattedHarga) {
          webhookFormData.append("harga", formattedHarga);
        }

        await fetch(BOOKING_WEBHOOK_URL, {
          method: "POST",
          body: webhookFormData,
          signal: AbortSignal.timeout(10_000),
        }).catch((err) => {
          console.error("Gagal update status n8n via BOOKING_WEBHOOK_URL:", err);
        });
      } catch (webhookErr) {
        console.error("Error sending update to n8n BOOKING_WEBHOOK_URL:", webhookErr);
      }
    }

    // DOKU mengharapkan respon 200 OK dengan format JSON
    return NextResponse.json({
      status: "SUCCESS",
      message: "DOKU notification received and synced with n8n as Lunas",
    });
  } catch (error: any) {
    console.error("Error processing DOKU notification:", error);
    return NextResponse.json(
      { status: "ERROR", message: error.message },
      { status: 500 }
    );
  }
}
