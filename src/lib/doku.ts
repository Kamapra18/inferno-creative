import crypto from "crypto";

export interface DokuOrderPayload {
  invoiceNumber: string;
  amount: number;
  currency?: string;
  callbackUrl?: string;
  autoRedirect?: boolean;
  lineItems?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  paymentDueDateMinutes?: number;
}

export interface DokuCheckoutResponse {
  paymentUrl: string;
  invoiceNumber: string;
  raw: any;
}

/**
 * Membersihkan string agar mematuhi regex validasi DOKU:
 * Diizinkan: a-z A-Z 0-9 . - / + , = _ : ' @ % ( ) dan spasi
 * Karakter terlarang seperti &, ?, !, #, $, *, ", dsb akan dihilangkan atau diganti.
 */
export function sanitizeDokuField(val?: string): string {
  if (!val) return "";
  return val
    .replace(/&/g, "dan")
    .replace(/[^a-zA-Z0-9.\-/+,=_:'@%() ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Membersihkan URL callback agar tidak mengandung '?' atau '&' yang dilarang oleh API DOKU
 */
export function sanitizeDokuUrl(url?: string): string {
  if (!url) return "";
  // Jika mengandung query parameter, potong sebelum tanda '?'
  const cleanUrl = url.includes("?") ? url.split("?")[0] : url;
  return cleanUrl.replace(/[^a-zA-Z0-9.\-/:_]/g, "").trim();
}

/**
 * Menghasilkan Digest SHA-256 Base64 dari request body JSON
 */
export function generateDokuDigest(body: object): string {
  const jsonString = JSON.stringify(body);
  return crypto.createHash("sha256").update(jsonString, "utf8").digest("base64");
}

/**
 * Menghasilkan Signature HMAC-SHA256 DOKU
 */
export function generateDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  digest,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  digest: string;
  secretKey: string;
}): string {
  const component =
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${requestTimestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digest}`;

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(component, "utf8")
    .digest("base64");

  return `HMACSHA256=${hmac}`;
}

/**
 * Memvalidasi Signature dari webhook notifikasi DOKU
 */
export function verifyDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  rawBody,
  incomingSignature,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  rawBody: string;
  incomingSignature: string;
  secretKey: string;
}): boolean {
  try {
    const digest = crypto
      .createHash("sha256")
      .update(rawBody, "utf8")
      .digest("base64");

    const expectedSignature = generateDokuSignature({
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      digest,
      secretKey,
    });

    return expectedSignature === incomingSignature;
  } catch (err) {
    console.error("Error verifying DOKU signature:", err);
    return false;
  }
}

/**
 * Membuat sesi DOKU Checkout dan mendapatkan URL pembayaran
 */
export async function createDokuCheckoutSession(
  payload: DokuOrderPayload
): Promise<DokuCheckoutResponse> {
  const clientId = process.env.DOKU_CLIENT_ID?.trim();
  const secretKey = process.env.DOKU_SECRET_KEY?.trim();
  const isProduction =
    process.env.DOKU_IS_PRODUCTION === "true" ||
    process.env.NEXT_PUBLIC_DOKU_IS_PRODUCTION === "true";

  if (!clientId || !secretKey) {
    throw new Error(
      "Kredensial DOKU belum dikonfigurasi. Harap tentukan DOKU_CLIENT_ID dan DOKU_SECRET_KEY pada file .env.local."
    );
  }

  const baseUrl = isProduction
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";
  const requestTarget = "/checkout/v1/payment";
  const endpoint = `${baseUrl}${requestTarget}`;

  // Sanitasi semua field agar 100% mematuhi aturan karakter DOKU API
  const cleanInvoiceNumber = (payload.invoiceNumber || "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64);

  const cleanCallbackUrl = sanitizeDokuUrl(payload.callbackUrl);

  const cleanLineItems = (payload.lineItems && payload.lineItems.length > 0)
    ? payload.lineItems.map((item) => ({
        name: sanitizeDokuField(item.name || "Layanan Inferno").slice(0, 50),
        price: Math.round(item.price),
        quantity: item.quantity || 1,
      }))
    : [
        {
          name: "Pembayaran Booking Inferno Creative",
          price: Math.round(payload.amount),
          quantity: 1,
        },
      ];

  const cleanCustomerName = sanitizeDokuField(
    payload.customer?.name || "Pelanggan Inferno"
  ).slice(0, 50);

  const cleanCustomerPhone = (payload.customer?.phone || "081234567890")
    .replace(/[^0-9]/g, "")
    .slice(0, 16);

  const cleanCustomerEmail = (
    payload.customer?.email || "customer@inferno-production.com"
  )
    .replace(/[^a-zA-Z0-9.@_-]/g, "")
    .slice(0, 60);

  // Susun request body yang telah bersih dari karakter invalid
  const requestBody: any = {
    order: {
      invoice_number: cleanInvoiceNumber,
      amount: Math.round(payload.amount),
      currency: "IDR",
      auto_redirect: payload.autoRedirect ?? true,
      line_items: cleanLineItems,
    },
    payment: {
      payment_due_date: payload.paymentDueDateMinutes || 60,
    },
    customer: {
      name: cleanCustomerName,
      email: cleanCustomerEmail,
      phone: cleanCustomerPhone,
    },
  };

  if (cleanCallbackUrl) {
    requestBody.order.callback_url = cleanCallbackUrl;
  }

  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z";
  const digest = generateDokuDigest(requestBody);
  const signature = generateDokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest,
    secretKey,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": requestTimestamp,
      Signature: signature,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("DOKU Checkout API Error:", {
      status: response.status,
      responseData,
      sentBody: requestBody,
    });
    const errorMessage =
      responseData?.error?.message ||
      responseData?.message ||
      `DOKU API returned status ${response.status}`;
    throw new Error(errorMessage);
  }

  const paymentUrl =
    responseData?.response?.payment?.url || responseData?.payment?.url;

  if (!paymentUrl) {
    console.error("Missing payment url in DOKU response:", responseData);
    throw new Error("URL pembayaran tidak ditemukan dalam respon DOKU.");
  }

  return {
    paymentUrl,
    invoiceNumber:
      responseData?.response?.order?.invoice_number ||
      responseData?.order?.invoice_number ||
      cleanInvoiceNumber,
    raw: responseData,
  };
}
